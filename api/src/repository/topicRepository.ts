import {prisma} from "../index";

export async function getAllTopic() {
	try {
		return await prisma.topic.findMany();
	} catch (error) {
		console.error('Error fetching persons:', error);
		throw error;
	}
}