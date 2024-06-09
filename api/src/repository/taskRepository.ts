import {prisma} from "../index";
import {Prisma} from "@prisma/client";
import {TaskRequest, TaskUpdateRequest, TaskUpdateValidation} from "../handlers/validators/task-validation";

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
export const getTaskByPersonId = async (personId: string) => {
	try {
		const person = await prisma.person.findUnique({
			where: {
				id: personId,
			},
			include: {
				task: true,
			},
		});

		if (!person) {
			throw new Error('User not found');
		}

		const personTask = person.task;

		return personTask;
	} catch (error) {
		// Gérer les erreurs
		throw new Error(`Error fetching task by user ID: ${error}`);
	}
};
export async function createTask(data: TaskRequest) {
	try {
		const newTask = await prisma.task.create({
			data: {
				...data,
				person: data.person ? {
					connect: data.person.map(id => ({ id }))
				} : undefined,
			}
		});
		return newTask;
	} catch (error) {
		console.error('Error creating task:', error);
		throw error;
	}
}

export async function updateTask(id: string, data: TaskUpdateRequest) {
	try {
		const { error } = TaskUpdateValidation.validate(data, { abortEarly: false });
		if (error) {
			throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
		}

		return await prisma.task.update({
			where: { id },
			data: {
				...data,
				endDate: data.endDate,
				person: data.person ? { connect: data.person.map(personId => ({ id: personId })) } : undefined,
			},
		});
	} catch (error) {
		console.error('Error updating task:', error);
		throw error;
	}
}