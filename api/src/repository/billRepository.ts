import { prisma } from "../index";
import {Prisma} from "@prisma/client";

export async function getAllBill() {
	try {
		return await prisma.bill.findMany();
	} catch (error) {
		console.error('Error fetching bills:', error);
		throw error;
	}
}

export async function getBillById(id: string) {
	try {
		return await prisma.bill.findUnique({ where: { id } });
	} catch (error) {
		console.error('Error fetching bill by ID:', error);
		throw error;
	}
}

export async function createBill(data: Prisma.BillCreateInput) {
	try {
		return await prisma.bill.create({data});
	} catch (error) {
		console.error('Error creating bill:', error);
		throw error;
	}
}