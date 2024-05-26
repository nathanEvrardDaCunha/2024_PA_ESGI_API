import {Prisma,PrismaClient} from "@prisma/client";
// @ts-ignore
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";
import {prisma} from "../index";
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

export async function updateDocument(id: string, data: Prisma.DocumentUpdateInput) {
	try {
		return await prisma.document.update({
			where: {id},
			data,
		});
	} catch (error) {
		console.error('Error updating document:', error);
		throw error;
	}
}
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
	const { title, description, fileUrl, authorFirstName, authorLastName } = req.body;

	try {
		const document = await prisma.document.create({
			data: {
				title,
				description,
				fileUrl,
				authorFirstName,
				authorLastName,
				creationDate: new Date(),
				status: 'active',
				accessLevel: 'public',
				version: 1,
				type: 'document',  // Ajout de la propriété manquante
			},
		});

		context.res = {
			status: 201,
			body: document,
		};
	} catch (error) {
		if (error instanceof Error) {
			context.res = {
				status: 500,
				body: error.message,
			};
		} else {
			context.res = {
				status: 500,
				body: 'An unexpected error occurred',
			};
		}
	}
};

export default httpTrigger;