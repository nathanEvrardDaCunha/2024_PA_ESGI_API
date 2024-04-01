import {prisma} from "../index";

export async function getAllPerson() {
  try {
    const persons = await prisma.person.findMany();
    return persons;
  } catch (error) {
    console.error('Error fetching persons:', error);
    throw error;
  }
}