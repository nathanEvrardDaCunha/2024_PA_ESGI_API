import {prisma} from "../index";

export async function getAllPerson() {
  try {
    return await prisma.person.findMany();
  } catch (error) {
    console.error('Error fetching persons:', error);
    throw error;
  }
}