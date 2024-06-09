import { Prisma, PrismaClient } from "@prisma/client";
import {DocumentRequest} from "../handlers/validators/document-validation";

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
export async function getDocumentsByUser(userId: string) {
	try {
		// Récupérer les documents créés par l'utilisateur
		const createdDocuments = await prisma.document.findMany({
			where: { authorId: userId },
		});

		// Récupérer les groupes auxquels l'utilisateur appartient
		const userGroups = await prisma.groupMembership.findMany({
			where: { personId: userId },
			select: { groupId: true },
		});

		const groupIds = userGroups.map((membership) => membership.groupId);

		// Récupérer les documents associés aux groupes de l'utilisateur
		const groupDocuments = await prisma.document.findMany({
			where: {
				groups: {
					some: { id: { in: groupIds } },
				},
			},
		});

		// Combiner les documents créés et ceux des groupes
		const allDocuments = [...createdDocuments, ...groupDocuments];

		// Supprimer les doublons (au cas où un document est à la fois créé et attribué via un groupe)
		const uniqueDocuments = allDocuments.filter(
			(doc, index, self) => index === self.findIndex((d) => d.id === doc.id)
		);

		return uniqueDocuments;
	} catch (error) {
		console.error('Error fetching documents by user:', error);
		throw error;
	}
}
export async function addDocumentToGroup(groupId: string, documentId: string) {
	try {
		return await prisma.group.update({
			where: { id: groupId },
			data: {
				documents: {
					connect: { id: documentId },
				},
			},
		});
	} catch (error) {
		console.error('Error adding document to group:', error);
		throw error;
	}
}
export async function createDocument(data: DocumentRequest) {
	const { title, description, fileUrl, authorId, groupIds=[] } = data;

	if (!title || !description || !fileUrl || !authorId ) {
		throw new Error('Missing required fields');
	}

	const documentData: Prisma.DocumentCreateInput = {
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