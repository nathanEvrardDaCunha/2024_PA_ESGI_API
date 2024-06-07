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
		const topic = await prisma.topic.findUnique({ where: { id: topicId } });
		if (!topic) throw new Error('Topic not found.');

		const currentRound = topic.currentRound;

		// Vérifier si un vote existe déjà pour ce tour et cet utilisateur
		const existingVote = await prisma.choice.findMany({
			where: {
				topicId,
				round: currentRound,
				voters: {
					some: {
						id: personId
					}
				}
			}
		});

		if (existingVote.length > 0) {
			throw new Error('You have already voted on this topic in the current round.');
		}

		// Enregistrement d'un nouveau vote
		const vote = await prisma.choice.update({
			where: { id: choiceId },
			data: {
				voters: {
					connect: { id: personId }
				}
			}
		});

		// Vérifier le quorum et passer au tour suivant si nécessaire
		await checkQuorumAndProceed(topicId);

		return vote;
	} catch (error) {
		console.error('Error submitting vote:', error);
		throw error;
	}
};

async function checkQuorumAndProceed(topicId: string) {
	const topic = await prisma.topic.findUnique({
		where: { id: topicId },
		include: {
			choices: {
				include: {
					voters: true // Inclure les votants pour chaque choix
				}
			},
			generalAssembly: {
				include: {
					person: true
				}
			}
		}
	});

	if (!topic) throw new Error('Topic not found.');

	const totalVoters = topic.generalAssembly ? topic.generalAssembly.person.length: 0;
	const totalVotes = topic.choices.reduce((acc, choice) => acc + choice.voters.length, 0);
	const quorumReached = (totalVotes / totalVoters) >= (topic.quorum / 100);

	if (quorumReached) {
		if (topic.currentRound < topic.totalRounds) {
			await prisma.topic.update({
				where: { id: topicId },
				data: { currentRound: topic.currentRound + 1 }
			});
		} else {
			// Fin du vote, traiter les résultats
			await finalizeVoting(topicId);
		}
	}
}

async function finalizeVoting(topicId: string) {
	// Logique pour finaliser le vote et enregistrer les résultats
	console.log(`Finalizing voting for topic ${topicId}`);
	// Implémente ici la logique pour déterminer le gagnant et mettre à jour le statut du topic
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