import {prisma} from "../index";
import {Prisma} from "@prisma/client";

export async function getAllMembership() {
	try {
		return await prisma.membership.findMany();
	} catch (error) {
		console.error('Error fetching memberships:', error);
		throw error;
	}
}

export async function createMembership(data: Prisma.MembershipCreateInput) {
	try {
		return await prisma.membership.create({data});
	} catch (error) {
		console.log('Error creating membership:', error);
		throw error;
	}
}