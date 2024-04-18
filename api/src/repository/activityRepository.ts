import {prisma} from "../index";
import {Prisma} from "@prisma/client";
import { ActivityValidation, ActivityUpdateValidation } from "../handlers/validators/activity-validation";
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

export async function createActivity(data: Prisma.ActivityCreateInput) {
	try {
		validateData(data, ActivityValidation); // Valider les données d'entrée
		return await prisma.activity.create({ data });
	} catch (error) {
		console.error('Error creating activity:', error);
		throw error;
	}
}

export async function updateActivity(id: string, data: Prisma.ActivityUpdateInput) {
	try {
		validateData(data, ActivityUpdateValidation); // Valider les données d'entrée
		return await prisma.activity.update({
			where: { id },
			data,
		});
	} catch (error) {
		console.error('Error updating activity:', error);
		throw error;
	}
}

// Fonction pour valider les données avec le schéma Joi
function validateData(data: any, schema: Joi.Schema) {
	const { error } = schema.validate(data);
	if (error) {
		throw new Error(error.details[0].message);
	}
}