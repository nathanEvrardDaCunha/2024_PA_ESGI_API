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

/*
export async function deleteLocation(locationId: string) {
	// TODO : Maybe refactor all those logic part to function like "deleteLocationFromPerson"...
	
	const relatedBills = await prisma.bill.findMany({
		where: { locationId },
	});
	await Promise.all(
		relatedBills.map(async (bill) => {
			await prisma.bill.update({
				where: { id: bill.id },
				data: { locationId: null }
			});
		})
	);
	
	const relatedPersons = await prisma.person.findMany({
		where: { locationId },
	});
	await Promise.all(
		relatedPersons.map(async (person) => {
			await prisma.person.update({
				where: { id: person.id },
				data: { locationId: null },
			});
		})
	);
	
	const relatedActivities = await prisma.activity.findMany({
		where: { location: { some: { id: locationId } } },
		include: { location: true },
	});
	await Promise.all(
		relatedActivities.map(async (activity) => {
			const updatedLocations = activity.location.filter(
				(loc) => loc.id !== locationId
			);
			await prisma.activity.update({
				where: { id: activity.id },
				data: { location: { set: updatedLocations } },
			});
		})
	);
	
	const relatedEquipment = await prisma.equipment.findMany({
		where: { location: { some: { id: locationId } } },
		include: { location: true },
	});
	await Promise.all(
		relatedEquipment.map(async (equipment) => {
			const updatedEquipment = equipment.location.filter(
				(loc) => loc.id !== locationId
			);
			await prisma.equipment.update({
				where: { id: equipment.id },
				data: { location: { set: updatedEquipment } },
			});
		})
	);
	
	// Finally, delete the location
	await prisma.location.delete({ where: { id: locationId } });
}
*/
