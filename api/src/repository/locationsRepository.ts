import {prisma} from "../index";
import {Prisma} from "@prisma/client";

export async function getAllLocation() {
	try {
		return await prisma.location.findMany();
	} catch (error) {
		console.error('Error fetching locations:', error);
		throw error;
	}
}

export async function getLocationById(id: string) {
	try {
		return await prisma.location.findUnique({ where: { id } });
	} catch (error) {
		console.error('Error fetching location by ID:', error);
		throw error;
	}
}

export async function createLocation(data: Prisma.LocationCreateInput) {
	try {
		return await prisma.location.create({data});
	} catch (error) {
		console.error('Error creating location:', error);
		throw error;
	}
}