import {prisma} from "../index";
import {Prisma} from "@prisma/client";

export async function getAllDocument() {
	try {
		return await prisma.document.findMany();
	} catch (error) {
		console.error('Error fetching documents:', error);
		throw error;
	}
}

export async function getDocumentById(id: string) {
	try {
		return await prisma.document.findUnique({ where: { id } });
	} catch (error) {
		console.error('Error fetching document by ID:', error);
		throw error;
	}
}

export async function createDocument(data: Prisma.DocumentCreateInput) {
	try {
		return await prisma.document.create({data});
	} catch (error) {
		console.error('Error creating document:', error);
		throw error;
	}
}