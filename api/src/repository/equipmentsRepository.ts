import {prisma} from "../index";

export async function getAllEquipment() {
	try {
		return await prisma.equipment.findMany();
	} catch (error) {
		console.error('Error fetching persons:', error);
		throw error;
	}
}