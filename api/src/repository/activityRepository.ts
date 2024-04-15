import {prisma} from "../index";
import {Prisma} from "@prisma/client";

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
		return await prisma.activity.create({data});
	} catch (error) {
		console.error('Error creating activitie:', error);
		throw error;
	}
}

export async function updateActivity(id: string, data: Prisma.ActivityUpdateInput) {
	try {
		return await prisma.activity.update({
			where: {id},
			data,
		});
	} catch (error) {
		console.error('Error updating activity:', error);
		throw error;
	}
}