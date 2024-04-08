import {prisma} from "../index";
import {Prisma} from "@prisma/client";

export async function getAllTopic() {
	try {
		return await prisma.topic.findMany();
	} catch (error) {
		console.error('Error fetching topics:', error);
		throw error;
	}
}

export async function createTopic(data: Prisma.TopicCreateInput) {
	try {
		return await prisma.topic.create({data});
	} catch (error) {
		console.error('Error creating topic:', error);
		throw error;
	}
}