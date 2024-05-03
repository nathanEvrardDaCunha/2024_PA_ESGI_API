import {prisma} from "../index";
import {Membership, Prisma} from "@prisma/client";

export async function getAllMembership() {
	try {
		return await prisma.membership.findMany();
	} catch (error) {
		console.error('Error fetching memberships:', error);
		throw error;
	}
}

export async function getMembershipById(id: string) {
	try {
		return await prisma.membership.findUnique({ where: { id } });
	} catch (error) {
		console.error('Error fetching membership by ID:', error);
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

export async function updateMembership(id: string, data: Prisma.MembershipUpdateInput) {
	try {
		return await prisma.membership.update({
			where: {id},
			data,
		});
	} catch (error) {
		console.error('Error updating membership:', error);
		throw error;
	}
}

export async function getMembershipsByUserId(userId: string): Promise<Membership[]> {
	try {
		const memberships = await prisma.membership.findMany({
			where: {
				personId: userId,
			},
			include: {
				person: true,
			},
		});
		return memberships;
	} catch (error) {
		console.error('Error fetching memberships by user ID:', error);
		throw error;
	}
}

export async function deleteMembershipById(membershipId: string): Promise<void> {
	try {
		await prisma.membership.delete({
			where: {
				id: membershipId,
			},
		});
	} catch (error) {
		console.error('Error deleting membership:', error);
		throw error;
	}
}