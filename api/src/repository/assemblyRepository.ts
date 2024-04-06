import {prisma} from "../index";

export async function getAllAssembly() {
	try {
		return await prisma.generalAssembly.findMany();
	} catch (error) {
		console.error('Error fetching persons:', error);
		throw error;
	}
}