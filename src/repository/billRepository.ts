import {prisma} from "../index";

export async function getAllBill() {
    try {
        return await prisma.bill.findMany();
    } catch (error) {
        console.error('Error fetching persons:', error);
        throw error;
    }
}