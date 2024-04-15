import {prisma} from "../index";
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

export async function updateBill(id: string, data: Prisma.BillUpdateInput) {
	try {
		return await prisma.bill.update({
			where: {id},
			data,
		});
	} catch (error) {
		console.error('Error updating bill:', error);
		throw error;
	}
}