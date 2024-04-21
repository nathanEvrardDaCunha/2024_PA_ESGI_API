import {prisma} from "../index";
import {Prisma} from "@prisma/client";
import {
	GeneralAssemblyRequest,
	GeneralAssemblyUpdateRequest,
	GeneralAssemblyValidation
} from "../handlers/validators/general-assembly-validation";

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
		const newAssembly = await prisma.generalAssembly.create({
			data: {
				meetingDate: data.meetingDate,
				status: data.status,
				outcome: data.outcome,
				creationDate: data.creationDate,
				endingDate: data.endingDate,
				topic: data.topic ? { connect: data.topic.map((id: string) => ({ id })) } : undefined, // Reliez les sujets à l'assemblée
				person: data.person? { connect: data.person.map((id: string) => ({ id })) }: undefined, // Reliez les personnes à l'assemblée
				activity:data.activityId?{ connect: { id: data.activityId } } : undefined,
				// Si vous avez d'autres champs à ajouter, faites-le ici
			},
			include: {
				person: true, // Incluez les détails des personnes liées à l'assemblée dans la réponse
				topic: true,
			},
		});

		return newAssembly;
	} catch (error) {
		console.error('Error creating assembly:', error);
		throw error;
	}
}

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
				topic: data.topic ? { connect: data.topic.map((topicId: string) => ({ id: topicId })) } : undefined,
				activity: data.activityId ? { connect: { id: data.activityId } } : undefined,
				// Ajoutez d'autres champs si nécessaire
			},
		});
	} catch (error) {
		console.error('Error updating assembly:', error);
		throw error;
	}
}