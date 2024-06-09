import {prisma} from "../index";
import {Prisma} from "@prisma/client";
import {TopicRequest, TopicUpdateRequest} from "../handlers/validators/topic-validation";

export async function getAllTopic() {
	try {
		return await prisma.topic.findMany();
	} catch (error) {
		console.error('Error fetching topics:', error);
		throw error;
	}
}

export async function getTopicById(id: string) {
	try {
		return await prisma.topic.findUnique({ where: { id } });
	} catch (error) {
		console.error('Error fetching topic by ID:', error);
		throw error;
	}
}

export async function createTopic(data: TopicRequest) {
	try {
		// Vérification que `data.choices` est un tableau avant de l'utiliser
		const choicesData = data.choices ? data.choices.map(choice => ({ ...choice, round: 1 })) : [];

		return await prisma.topic.create({
			data: {
				...data,
				quorum: data.quorum, // Assure-toi que `quorum` est présent
				choices: {
					create: choicesData
				}
			},
			include: {
				choices: true
			}
		});
	} catch (error) {
		console.error('Error creating topic:', error);
		throw error;
	}
}
export const submitVote = async (personId: string, topicId: string, choiceId: string) => {
	try {
		const existingVote = await prisma.choice.findFirst({
			where: {
				topicId,
				voters: {
					some: { id: personId }
				}
			}
		});

		if (existingVote) {
			throw new Error('You have already voted on this topic.');
		}

		const vote = await prisma.choice.update({
			where: { id: choiceId },
			data: {
				voters: { connect: { id: personId } },
				voteCount: { increment: 1 }
			}
		});

		await checkQuorumAndProceed(topicId);
		return vote;
	} catch (error) {
		console.error('Error submitting vote:', error);
		throw error;
	}
};
export const calculateVotes = async (topicId: string) => {
	try {
		const topic = await prisma.topic.findUnique({
			where: { id: topicId },
			include: {
				choices: {
					include: {
						voters: true
					}
				}
			}
		});

		if (!topic) {
			throw new Error('Topic not found.');
		}

		const results = topic.choices.map(choice => ({
			description: choice.description,
			voteCount: choice.voters.length
		}));

		return results;
	} catch (error) {
		console.error('Error calculating votes:', error);
		throw error;
	}
};
const checkQuorumAndProceed = async (topicId: string) => {
	const topic = await prisma.topic.findUnique({
		where: { id: topicId },
		include: {
			choices: {
				include: { voters: true },
				where: { round: { equals: 1 } }
			},
			generalAssembly: { include: { person: true } }
		}
	});

	if (!topic) throw new Error('Topic not found.');

	const totalVoters = topic.generalAssembly.person.length;
	const totalVotes = topic.choices.reduce((acc, choice) => acc + choice.voters.length, 0);
	const quorumReached = (totalVotes / totalVoters) >= (topic.quorum / 100);

	if (quorumReached) {
		if (topic.currentRound < topic.totalRounds) {
			// Passer au round suivant et filtrer les choix
			const topChoices = getTopChoices(topic.choices);

			await prisma.$transaction([
				prisma.choice.updateMany({
					where: { id: { in: topChoices.map(choice => choice.id) } },
					data: { round: topic.currentRound + 1 }
				}),
				prisma.topic.update({
					where: { id: topicId },
					data: { currentRound: topic.currentRound + 1 }
				})
			]);
		} else {
			// Fin du vote, traiter les résultats
			await finalizeVoting(topicId);
		}
	}
};

const getTopChoices = (choices) => {
	const sortedChoices = choices.sort((a, b) => b.voteCount - a.voteCount);
	return sortedChoices.slice(0, 2);
};

async function finalizeVoting(topicId: string) {
	console.log(`Finalizing voting for topic ${topicId}`);
}

export async function updateTopic(id: string, data: TopicUpdateRequest) {
	try {
		const updateData: Prisma.TopicUpdateInput = {
			label: data.label,
			description: data.description,
			status: data.status,
			isAnonyme: data.isAnonyme,
			modality: data.modality,
		};

		// Handling choices if they are part of the update request
		if (data.choices){
			updateData["choices"]={
				updateMany: data.choices.map(choice =>({
					where:{id:choice.id},
					data:{...data},
				})),
			};
		}

		return await prisma.topic.update({
			where: { id },
			data: updateData,
			include: {
				choices: true, // Optionally include the updated choices in the returned object
			},
		});
	} catch (error) {
		console.error('Error updating topic:', error);
		throw error;
	}
}