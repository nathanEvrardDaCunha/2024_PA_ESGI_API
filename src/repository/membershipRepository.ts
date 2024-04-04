import {prisma} from "../index";

export async function getAllMembership() {
	try {
		return await prisma.membership.findMany();
	} catch (error) {
		console.error('Error fetching persons:', error);
		throw error;
	}
}