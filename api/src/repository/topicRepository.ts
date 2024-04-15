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

export async function getTopicById(id: string) {
	try {
		return await prisma.topic.findUnique({ where: { id } });
	} catch (error) {
		console.error('Error fetching topic by ID:', error);
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

export async function updateTopic(id: string, data: Prisma.TopicUpdateInput) {
	try {
		return await prisma.topic.update({
			where: {id},
			data,
		});
	} catch (error) {
		console.error('Error updating topic:', error);
		throw error;
	}
}