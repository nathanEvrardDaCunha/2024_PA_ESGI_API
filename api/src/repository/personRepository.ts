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

export async function getPersonById(id: string) {
	try {
		return await prisma.person.findUnique({ where: { id } });
	} catch (error) {
		console.error('Error fetching person by ID:', error);
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