import {prisma} from "../index";

export async function getAllSession() {
	try {
		return await prisma.session.findMany();
	} catch (error) {
		console.error('Error fetching persons:', error);
		throw error;
	}
}