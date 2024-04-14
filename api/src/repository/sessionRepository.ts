import {prisma} from "../index";
import {Prisma} from "@prisma/client";

export async function getAllSession() {
	try {
		return await prisma.session.findMany();
	} catch (error) {
		console.error('Error fetching sessions:', error);
		throw error;
	}
}

export async function getSessionById(id: string) {
	try {
		return await prisma.session.findUnique({ where: { id } });
	} catch (error) {
		console.error('Error fetching session by ID:', error);
		throw error;
	}
}

export async function createSession(data: Prisma.SessionCreateInput) {
	try {
		return await prisma.session.create({data});
	} catch (error) {
		console.error('Error creating session:', error);
		throw error;
	}
}