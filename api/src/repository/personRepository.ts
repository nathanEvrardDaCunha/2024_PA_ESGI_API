import {prisma} from "../index";
import {Prisma} from "@prisma/client";

export async function getAllPerson() {
	try {
		return await prisma.person.findMany();
	} catch (error) {
		console.error('Error fetching persons:', error);
		throw error;
	}
}

export async function createPerson(data: Prisma.PersonCreateInput) {
	try {
		return await prisma.person.create({data});
	} catch (error) {
		console.error('Error creating person:', error);
		throw error;
	}
}