import {prisma} from "../index";
import {Prisma} from "@prisma/client";
import {LoginPersonRequest, PersonRequest, PersonUpdateRequest} from "../handlers/validators/person-validation";
import {compare, hash} from "bcrypt";
import {generateToken} from "../handlers/middleware/auth-middleware";

export async function getAllPerson() {
	try {
		return await prisma.person.findMany();
	} catch (error) {
		console.error('Error fetching persons:', error);
		throw error;
	}
}

export async function getPersonById(id: string) {
	try {
		return await prisma.person.findUnique({ where: { id } });
	} catch (error) {
		console.error('Error fetching person by ID:', error);
		throw error;
	}
}

export async function createPerson(data: Prisma.PersonCreateInput) {
	try {
		return await prisma.person.create({data});
	} catch (error) {
		console.error('Error creating person:', error);
		throw error;
	}
}

export async function updatePerson(id: string, data: PersonUpdateRequest) {
	try {
		if(data.password){
			const hashedPassword = await hash(data.password, 10);
			data.password=hashedPassword;
		}
		return await prisma.person.update({
			where: {id},
			data,
		});
	} catch (error) {
		console.error('Error updating person:', error);
		throw error;
	}
}
export async function registerUser(data: PersonRequest) {
	try {
		const hashedPassword = await hash(data.password, 10);
		const personData = { ...data, password: hashedPassword };
		const personRepository = await prisma.person.create({ data: personData });
		return { id: personRepository.id, email: personRepository.email, role: personRepository.role };
	} catch (error) {
		console.error("Error registering user:", error);
		throw error;
	}
}

export async function loginUser(data: LoginPersonRequest) {
	try {
		const personRepository = await prisma.person.findFirst({
			where: { email: data.email },
		});
		if (!personRepository) {
			throw new Error("Username or password not valid");
		}
		const isValid = await compare(data.password, personRepository.password);
		if (!isValid) {
			throw new Error("Username or password not valid");
		}
		const token = await generateToken(personRepository.id);
		return { id: personRepository.id,token };
	} catch (error) {
		console.error("Error logging in user:", error);
		throw error;
	}
}

export async function deletePersonById(id: string) {
	try {
		const deletedPerson = await prisma.$transaction(async (prisma) => {
			// Delete session records
			await prisma.session.deleteMany({ where: { personId: id } });
			
			// Delete or update related Donation records
			await prisma.donation.deleteMany({ where: { personId: id } });
			await prisma.membership.deleteMany({ where: { personId: id } });
			
			// Disconnect the Person record from other related records
			await prisma.person.update({
				where: { id },
				data: {
					generalAssembly: { disconnect: [] },
					topic: { disconnect: [] },
					equipment: { disconnect: [] },
					task: { disconnect: [] },
					location: { disconnect: true },
				},
			});
			
			// Finally, delete the Person record
			const deletedPerson = await prisma.person.delete({ where: { id } });
			return deletedPerson;
		});
		
		return deletedPerson;
	} catch (error) {
		console.error('Error deleting person by ID:', error);
		throw error;
	}
}