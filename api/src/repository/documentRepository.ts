import {prisma} from "../index";

export async function getAllDocument() {
	try {
		return await prisma.document.findMany();
	} catch (error) {
		console.error('Error fetching persons:', error);
		throw error;
	}
}