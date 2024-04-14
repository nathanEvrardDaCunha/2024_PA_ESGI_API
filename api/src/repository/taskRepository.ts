import {prisma} from "../index";
import {Prisma} from "@prisma/client";

export async function getAllTask() {
	try {
		return await prisma.task.findMany();
	} catch (error) {
		console.error('Error fetching tasks:', error);
		throw error;
	}
}

export async function getTaskById(id: string) {
	try {
		return await prisma.task.findUnique({ where: { id } });
	} catch (error) {
		console.error('Error fetching task by ID:', error);
		throw error;
	}
}

export async function createTask(data: Prisma.TaskCreateInput) {
	try {
		return await prisma.task.create({data});
	} catch (error) {
		console.error('Error creating task:', error);
		throw error;
	}
}