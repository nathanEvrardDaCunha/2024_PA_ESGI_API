import {prisma} from "../index";
import {Prisma} from "@prisma/client";
import {
	ActivityValidation,
	ActivityUpdateValidation,
	ActivityRequest, ActivityUpdateRequest
} from "../handlers/validators/activity-validation";
import Joi from "joi";

export async function getAllActivity() {
	try {
		return await prisma.activity.findMany();
	} catch (error) {
		console.error('Error fetching activities:', error);
		throw error;
	}
}

export async function getActivityById(id: string) {
	try {
		return await prisma.activity.findUnique({ where: { id } });
	} catch (error) {
		console.error('Error fetching activity by ID:', error);
		throw error;
	}
}

export async function createActivity(data: ActivityRequest) {
	try {
		return await prisma.activity.create({ data: {
				...data,
				location: data.location ? { connect: data.location.map((id: string) => ({ id })) } : undefined, // Reliez les location à l'activité
				equipment: data.equipment ? { connect: data.equipment.map((id: string) => ({ id })) } : undefined, // Reliez les location à l'activité
				task: data.task ? { connect: data.task.map((id: string) => ({ id })) } : undefined, // Reliez les location à l'activité
				document: data.document ? { connect: data.document.map((id: string) => ({ id })) } : undefined, // Reliez les location à l'activité

			}
		});
	} catch (error) {
		console.error('Error creating activity:', error);
		throw error;
	}
}

export async function updateActivity(id: string, data: ActivityUpdateRequest) {
	try {
		validateData(data, ActivityUpdateValidation); // Valider les données d'entrée
		return await prisma.activity.update({
			where: { id },
			data: {
				...data,
				location: data.location ? { connect: data.location.map((id: string) => ({ id })) } : undefined,
				equipment: data.equipment ? { connect: data.equipment.map((id: string) => ({ id })) } : undefined,
				task: data.task ? { connect: data.task.map((id: string) => ({ id })) } : undefined,
				document: data.document ? { connect: data.document.map((id: string) => ({ id })) } : undefined,
			},
		});
	} catch (error) {
		console.error('Error updating activity:', error);
		throw error;
	}
}
export async function getActivityByPersonIdViaTask(id: string) {
	const activities = await prisma.activity.findMany({
		where: {
			task: {
				some: {
					person: {
						some: {
							id: id
						}
					}
				}
			}
		},
		include: {
			equipment: true,
			document: true,
			location: true
		}
	});

	return activities;
}
// Fonction pour valider les données avec le schéma Joi
function validateData(data: any, schema: Joi.Schema) {
	const { error } = schema.validate(data);
	if (error) {
		throw new Error(error.details[0].message);
	}
}