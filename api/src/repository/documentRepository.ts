import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllDocument() {
	try {
		return await prisma.document.findMany();
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error fetching documents:', error.message);
		} else {
			console.error('Error fetching documents:', error);
		}
		throw error;
	}
}

export async function getDocumentById(id: string) {
	try {
		return await prisma.document.findUnique({ where: { id } });
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error fetching document by ID:', error.message);
		} else {
			console.error('Error fetching document by ID:', error);
		}
		throw error;
	}
}

export async function createDocument(data: Prisma.DocumentCreateInput & { authorId: string; groupIds: string[] }) {
	const { title, description, fileUrl, authorId, groupIds } = data;

	if (!title || !description || !fileUrl || !authorId) {
		throw new Error('Missing required fields');
	}

	const documentData = {
		title,
		description,
		fileUrl,
		author: { connect: { id: authorId } },
		groups: { connect: groupIds.map(id => ({ id })) },
		creationDate: new Date(),
		lastModified: new Date(),
		status: 'active',
		accessLevel: 'private',
		version: 1,
		type: 'document',
	};

	try {
		return await prisma.document.create({ data: documentData });
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error creating document:', error.message);
		} else {
			console.error('Error creating document:', error);
		}
		throw error;
	}
}

export async function updateDocument(id: string, data: Prisma.DocumentUpdateInput) {
	try {
		return await prisma.document.update({
			where: { id },
			data,
		});
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error updating document:', error.message);
		} else {
			console.error('Error updating document:', error);
		}
		throw error;
	}
}
