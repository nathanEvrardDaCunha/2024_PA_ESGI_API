import {prisma} from "../index";
import {Prisma} from "@prisma/client";

export async function getAllAssembly() {
	try {
		return await prisma.generalAssembly.findMany();
	} catch (error) {
		console.error('Error fetching assemblies:', error);
		throw error;
	}
}

export async function createAssembly(data: Prisma.GeneralAssemblyCreateInput) {
	try {
		return await prisma.generalAssembly.create({data});
	} catch (error) {
		console.error('Error creating assembly:', error);
		throw error;
	}
}