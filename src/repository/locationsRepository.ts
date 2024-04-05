import {prisma} from "../index";
import {Prisma} from "@prisma/client";

export async function getAllLocation() {
	try {
		return await prisma.location.findMany();
	} catch (error) {
		console.error('Error fetching persons:', error);
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

export async function doesLocationExist(address: string, postalCode: string, country: string): Promise<Boolean>{
	const existingLocation = await prisma.location.findFirst({
		where: {
			address,
			postalCode,
			country,
		},
		select: {
			id: true,
		},
	});
	
	if(existingLocation){
		return true;
	}
	return false;
}