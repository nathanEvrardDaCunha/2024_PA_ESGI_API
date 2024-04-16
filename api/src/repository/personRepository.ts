import {prisma} from "../index";
import {Prisma} from "@prisma/client";
import {LoginPersonRequest, PersonRequest} from "../handlers/validators/person-validation";
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

export async function updatePerson(id: string, data: Prisma.PersonUpdateInput) {
	try {
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
		return { token };
	} catch (error) {
		console.error("Error logging in user:", error);
		throw error;
	}
}