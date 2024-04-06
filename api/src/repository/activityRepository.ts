import {prisma} from "../index";

export async function getAllActivity() {
	try {
		return await prisma.activity.findMany();
	} catch (error) {
		console.error('Error fetching persons:', error);
		throw error;
	}
}