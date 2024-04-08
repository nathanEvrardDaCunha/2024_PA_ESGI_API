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

export async function createActivity(data: Prisma.ActivityCreateInput) {
	try {
		return await prisma.activity.create({data});
	} catch (error) {
		console.error('Error creating activitie:', error);
		throw error;
	}
}