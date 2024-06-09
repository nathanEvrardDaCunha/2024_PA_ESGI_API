import {prisma} from "../index";
import {Prisma} from "@prisma/client";
import {
	GeneralAssemblyRequest,
	GeneralAssemblyUpdateRequest,
	GeneralAssemblyValidation
} from "../handlers/validators/general-assembly-validation";
import {TopicRequest} from "../handlers/validators/topic-validation";

export async function getAllAssembly() {
	try {
		return await prisma.generalAssembly.findMany();
	} catch (error) {
		console.error('Error fetching assemblies:', error);
		throw error;
	}
}

export async function getAssemblyById(id: string) {
	try {
		return await prisma.generalAssembly.findUnique({ where: { id } });
	} catch (error) {
		console.error('Error fetching assembly by ID:', error);
		throw error;
	}
}

export async function createAssembly(data: GeneralAssemblyRequest) {
	try {
		const topicsData = data.topics ? data.topics.map(topicData => ({
			label: topicData.label,
			description: topicData.description,
			status: topicData.status,
			isAnonyme: topicData.isAnonyme,
			modality: topicData.modality,
			quorum: topicData.quorum,
			currentRound: topicData.currentRound,
			totalRounds: topicData.totalRounds,
			choices: topicData.choices ? {
				create: topicData.choices.map(choiceData => ({
					description: choiceData.description,
					round: 1
				}))
			} : undefined
		})) : [];

		const newAssembly = await prisma.generalAssembly.create({
			data: {
				meetingDate: data.meetingDate,
				status: data.status,
				outcome: data.outcome,
				creationDate: data.creationDate,
				endingDate: data.endingDate,
				topics: {
					create: topicsData
				},
				person: data.person ? {
					connect: data.person.map((id: string) => ({ id }))
				} : undefined,
				activity: data.activityId ? { connect: { id: data.activityId } } : undefined
			},
			include: {
				person: true,
				topics: {
					include: {
						choices: true
					}
				}
			}
		});

		return newAssembly;
	} catch (error) {
		console.error('Error creating assembly:', error);
		throw error;
	}
}
export const calculateAssemblyVotes = async (assemblyId: string) => {
	try {
		const assembly = await prisma.generalAssembly.findUnique({
			where: { id: assemblyId },
			include: {
				topics: {
					include: {
						choices: {
							include: {
								voters: true
							}
						}
					}
				}
			}
		});

		if (!assembly) {
			throw new Error('Assembly not found.');
		}

		const results = assembly.topics.map(topic => ({
			topicLabel: topic.label,
			topicDescription: topic.description,
			choices: topic.choices.map(choice => ({
				description: choice.description,
				voteCount: choice.voters.length
			}))
		}));

		return results;
	} catch (error) {
		console.error('Error calculating votes:', error);
		throw error;
	}
};
export const getAssemblyByPersonId = async (personId: string) => {
	try {
		const assemblies = await prisma.generalAssembly.findMany({
			where: {
				person: {
					some: {
						id: personId
					}
				}
			},
			include: {
				topics: {
					include: {
						choices: true  // Assurez-vous que les choix sont inclus
					}
				}
			}
		});
		return assemblies;
	} catch (error) {
		console.error('Failed to fetch assemblies:', error);
		throw new Error('Failed to fetch assemblies');
	}
};
export async function updateAssembly(id: string, data: GeneralAssemblyUpdateRequest) {
	try {
		return await prisma.generalAssembly.update({
			where: { id },
			data: {
				meetingDate: data.meetingDate,
				status: data.status,
				outcome: data.outcome,
				creationDate: data.creationDate,
				endingDate: data.endingDate,
				person: data.person ? { connect: data.person.map((personId: string) => ({ id: personId })) } : undefined,
				topics: data.topics ? { connect: data.topics.map((topicId: string) => ({ id: topicId })) } : undefined,
				activity: data.activityId ? { connect: { id: data.activityId } } : undefined,
				// Ajoutez d'autres champs si nécessaire
			},
		});
	} catch (error) {
		console.error('Error updating assembly:', error);
		throw error;
	}
}
export async function updateAssemblyWithPersons(assemblyId: string, personIds: any[]) {
	try {
		return await prisma.generalAssembly.update({
			where: { id: assemblyId },
			data: {
				person: {
					connect: personIds.map(id => ({ id }))
				}
			},
			include: {
				person: true
			}
		});
	} catch (error) {
		console.error('Error updating assembly:', error);
		throw error;
	}
}