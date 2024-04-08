import {prisma} from "../index";
import {Prisma} from "@prisma/client";

export async function getAllDonation() {
	try {
		return await prisma.donation.findMany();
	} catch (error) {
		console.error('Error fetching donations:', error);
		throw error;
	}
}

export async function createDonation(data: Prisma.DonationCreateInput) {
	try {
		return await prisma.donation.create({data});
	} catch (error) {
		console.error('Error creating donation:', error);
		throw error;
	}
}