import { Prisma} from "@prisma/client";
import {DocumentRequest} from "../handlers/validators/document-validation";
import archiver from 'archiver';
import path from 'path';
import * as fs from "fs";
import axios from "axios";
import {prisma} from "../index";
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

		const createdDocuments = await prisma.document.findMany({
			where: { authorId: userId },
			include: {
				accessors: {
					where: { personId: userId },
					select: { path: true },
				},
			},
		});


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
			include: {
				accessors: {
					where: { personId: userId },
					select: { path: true },
				},
			},
		});

		// Combiner les documents créés et ceux des groupes
		const allDocuments = [...createdDocuments, ...groupDocuments];

		// Supprimer les doublons (au cas où un document est à la fois créé et attribué via un groupe)
		const uniqueDocuments = allDocuments.filter(
			(doc, index, self) => index === self.findIndex((d) => d.id === doc.id)
		);

		// Ajouter le path au document
		const documentsWithPath = uniqueDocuments.map(doc => ({
			...doc,
			path: doc.accessors[0]?.path || '',
		}));

		return documentsWithPath;
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
	const { title, description, fileUrl, type, authorId } = data;
	if (!title || !description || !fileUrl || !type || !authorId) {
		throw new Error('Missing required fields');
	}

	const documentData: Prisma.DocumentCreateInput = {
		title:title+"."+type,
		description,
		fileUrl,
		type,
		author: { connect: { id: authorId } },
		creationDate: new Date(),
		lastModified: new Date(),
		status: 'active',
		accessLevel: 'private',
		version: 1,
	};

	try {
		const document = await prisma.document.create({ data: documentData });

		// Créer une entrée PersonDocument pour l'auteur
		const path = `/documents/`;  // Chemin basé sur l'ID du document, peut être ajusté selon les besoins
		await prisma.personDocument.create({
			data: {
				personId: authorId,
				documentId: document.id,
				path: path,
			},
		});

		return document;
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error creating document:', error.message);
		} else {
			console.error('Error creating document:', error);
		}
		throw error;
	}
}
export async function createPersonDocumentsFromGroup(groupId: string, documentId: string, path: string) {
	try {
		const groupMembers = await prisma.groupMembership.findMany({
			where: { groupId: groupId },
			include: { person: true },
		});

		const personDocuments = groupMembers.map(member => ({
			personId: member.personId,
			documentId: documentId,
			path: path,
		}));

		const createdPersonDocuments = await prisma.personDocument.createMany({
			data: personDocuments,
			skipDuplicates: true, // ignore doublon
		});

		console.log(`Created ${createdPersonDocuments.count} PersonDocument entries.`);
	} catch (error) {
		console.error('Error creating PersonDocument entries:', error);
	} finally {
		await prisma.$disconnect();
	}
}
export async function updateFolderPaths(oldPath: string, newPath: string){
	const documents = await prisma.personDocument.findMany({
		where: {
			path: {
				startsWith: oldPath,
			},
		},
	});

	for (const doc of documents) {
		const updatedPath = doc.path.replace(oldPath, newPath);
		await prisma.personDocument.updateMany({
			where: { documentId: doc.documentId, personId: doc.personId },
			data: { path: updatedPath },
		});
	}
};
export interface CustomDocument {
	id: string;
	title: string;
	creationDate: Date;
	lastModified: Date | null;
	type: string;
	description: string;
	accessLevel: string;
	version: number;
	status: string;
	fileUrl: string;
	authorId: string;
	path: string;
}

const addFilesToArchive = async (archive: archiver.Archiver, documents: CustomDocument[], rootFolder: string) => {
	const addedFiles = []; // Array to track added files

	for (const doc of documents) {
		if (!doc.fileUrl) {
			console.warn(`Document ${doc.title} does not have a fileUrl`);
			continue;
		}
		const response = await axios.get(doc.fileUrl, { responseType: 'stream' });

		// Remove the root folder from the path
		let relativePath = doc.path.replace(rootFolder, '');
		if (relativePath.startsWith('/')) {
			relativePath = relativePath.substring(1);
		}

		// Remove the initial folder part from the relative path to avoid nesting in the archive
		const pathParts = relativePath.split('/');
		pathParts.shift();
		relativePath = pathParts.join('/');

		// Adjust the file path to ensure the folder structure is maintained
		const filePath = relativePath ? `${relativePath}/${doc.title}` : `${doc.title}`;

		archive.append(response.data, { name: filePath });

		// Track the added file
		addedFiles.push(filePath);
	}

	// Debugging output to show the content of the archive
	console.log("Files added to archive:", addedFiles);
};

export const createZipFromDocuments = async (documents: CustomDocument[], res: any, rootFolder: string): Promise<void> => {
	const archive = archiver('zip', {
		zlib: { level: 9 }
	});

	archive.on('error', function(err) {
		throw err;
	});

	res.attachment(`${rootFolder}.zip`);
	archive.pipe(res);

	await addFilesToArchive(archive, documents, rootFolder);

	await archive.finalize();
};



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
export async function updatePersonDocument(documentId: string,personId: string, path:string) {
	try {

		return await prisma.personDocument.updateMany({
			where: { documentId, personId},
			data:{path},
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