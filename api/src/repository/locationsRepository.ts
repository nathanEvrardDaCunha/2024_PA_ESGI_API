import {prisma} from "../index";
import {Prisma} from "@prisma/client";
import {LocationUpdateRequest} from "../handlers/validators/location-validation";

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
export const getLocationByPersonId = async (personId: string) => {
	try {
		// Utiliser Prisma pour trouver la localisation de l'utilisateur
		const person = await prisma.person.findUnique({
			where: {
				id: personId,
			},
			include: {
				location: true, // Inclure les informations de localisation pour l'utilisateur
			},
		});

		if (!person) {
			throw new Error('User not found');
		}

		// Récupérer la localisation associée à l'utilisateur
		const personLocation = person.location;

		return personLocation;
	} catch (error) {
		// Gérer les erreurs
		throw new Error(`Error fetching locations by user ID: ${error}`);
	}
};
export const updateLocationByPersonId = async (personId: string,data:LocationUpdateRequest) => {
	try {
		// Utiliser Prisma pour trouver la localisation de l'utilisateur
		const person = await prisma.person.update({
			where: {
				id:personId
			},
			data:{
				location:{
					update:data,
				}
			},
			include: {
				location: true, // Inclure les informations de localisation pour l'utilisateur
			},
		});

		if (!person) {
			throw new Error('User not found');
		}

		// Récupérer la localisation associée à l'utilisateur
		const personLocation = person.location;

		return personLocation;
	} catch (error) {
		// Gérer les erreurs
		throw new Error(`Error fetching locations by user ID: ${error}`);
	}
};
export async function createLocation(data: Prisma.LocationCreateInput) {
	try {
		return await prisma.location.create({data});
	} catch (error) {
		console.error('Error creating location:', error);
		throw error;
	}
}

export async function updateLocation(id: string, data: Prisma.LocationUpdateInput) {
	try {
		return await prisma.location.update({
			where: {id},
			data,
		});
	} catch (error) {
		console.error('Error updating location:', error);
		throw error;
	}
}