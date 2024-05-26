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
export async function findPersonByEmail(email: string) {
	try {
		return await prisma.person.findUnique({ where: { email } });
	} catch (error) {
		console.error('Error finding person by email:', error);
		throw error;
	}
}

export async function createLocation(data: Prisma.LocationCreateInput, email: string) {
	try {
		const person = await findPersonByEmail(email);
		
		if (!person) {
			throw new Error('Person not found');
		}
		
		const existingLocation = await prisma.location.findFirst({
			where: {
				address: data.address,
				postalCode: data.postalCode,
				country: data.country,
			},
		});
		
		if (existingLocation) {
			// Connect the user to the existing location
			await prisma.location.update({
				where: { id: existingLocation.id },
				data: {
					person: {
						connect: { id: person.id },
					},
				},
			});
			
			return existingLocation;
		} else {
			// Create a new location and add the user to it
			const newLocation = await prisma.location.create({
				data: {
					...data,
					person: {
						connect: { id: person.id },
					},
				},
			});
			
			return newLocation;
		}
	} catch (error) {
		console.error('Error creating location:', error);
		throw error;
	}
}

export async function createBusinessLocation(data: Prisma.LocationCreateInput) {
	try {
		const existingLocation = await prisma.location.findFirst({
			where: {
				address: data.address,
				postalCode: data.postalCode,
				country: data.country,
			},
		});
		
		if (existingLocation) {
			const updatedLocation = await prisma.location.update({
				where: { id: existingLocation.id },
				data: {
					...data,
				},
			});
			
			return updatedLocation;
		} else {
			const newLocation = await prisma.location.create({
				data: {
					...data,
				},
			});
			
			return newLocation;
		}
	} catch (error) {
		console.error('Error creating business location:', error);
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

export async function findLocationByUserId(userId: string) {
	try {
		const person = await prisma.person.findUnique({
			where: {
				id: userId,
			},
			include: {
				location: true,
			},
		});
		
		if (!person) {
			return null;
		}
		
		return person.location;
	} catch (error) {
		console.error('Error finding location by user ID:', error);
		throw error;
	}
}


export async function isLocationUsed(locationId: string): Promise<boolean> {
	try {
		const isUsedByPerson = await prisma.person.findFirst({
			where: { locationId },
		});
		
		const isUsedByActivity = await prisma.activity.findFirst({
			where: { location: { some: { id: locationId } } },
		});
		
		const isUsedByEquipment = await prisma.equipment.findFirst({
			where: { location: { some: { id: locationId } } },
		});
		
		return !!(isUsedByPerson || isUsedByActivity || isUsedByEquipment);
	} catch (error) {
		console.error('Error checking location usage:', error);
		throw error;
	}
}

export async function deleteLocation(locationId: string): Promise<void> {
	try {
		await prisma.location.delete({
			where: { id: locationId },
		});
	} catch (error) {
		console.error('Error deleting location:', error);
		throw error;
	}
}