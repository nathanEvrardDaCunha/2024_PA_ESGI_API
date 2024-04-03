import {prisma} from "../index";

export async function getAllTask() {
    try {
        return await prisma.task.findMany();
    } catch (error) {
        console.error('Error fetching persons:', error);
        throw error;
    }
}