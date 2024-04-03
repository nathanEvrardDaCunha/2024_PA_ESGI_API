import {prisma} from "../index";

export async function getAllLocation() {
    try {
        return await prisma.location.findMany();
    } catch (error) {
        console.error('Error fetching persons:', error);
        throw error;
    }
}