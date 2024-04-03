import {prisma} from "../index";

export async function getAllDonation() {
    try {
        return await prisma.donation.findMany();
    } catch (error) {
        console.error('Error fetching persons:', error);
        throw error;
    }
}