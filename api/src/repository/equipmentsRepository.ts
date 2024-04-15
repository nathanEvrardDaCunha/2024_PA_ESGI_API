import {prisma} from "../index";
import {Prisma} from "@prisma/client";

export async function getAllEquipment() {
	try {
		return await prisma.equipment.findMany();
	} catch (error) {
		console.error('Error fetching equipments:', error);
		throw error;
	}
}

export async function getEquipmentById(id: string) {
	try {
		return await prisma.equipment.findUnique({ where: { id } });
	} catch (error) {
		console.error('Error fetching equipment by ID:', error);
		throw error;
	}
}

export async function createEquipment(data: Prisma.EquipmentCreateInput) {
	try {
		return await prisma.equipment.create({data});
	} catch (error) {
		console.error('Error creating equipment:', error);
		throw error;
	}
}

export async function updateEquipment(id: string, data: Prisma.EquipmentUpdateInput) {
	try {
		return await prisma.equipment.update({
			where: {id},
			data,
		});
	} catch (error) {
		console.error('Error updating equipment:', error);
		throw error;
	}
}