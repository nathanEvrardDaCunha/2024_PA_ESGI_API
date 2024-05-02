import {prisma} from "../index";
import {Prisma} from "@prisma/client";
import {TopicRequest, TopicUpdateRequest} from "../handlers/validators/topic-validation";

export async function getAllTopic() {
	try {
		return await prisma.topic.findMany();
	} catch (error) {
		console.error('Error fetching topics:', error);
		throw error;
	}
}

export async function getTopicById(id: string) {
	try {
		return await prisma.topic.findUnique({ where: { id } });
	} catch (error) {
		console.error('Error fetching topic by ID:', error);
		throw error;
	}
}

export async function createTopic(data: TopicRequest) {
	try {
		return await prisma.topic.create({
			data: {
				...data,
				choices: {
					create: data.choices
				}
			},
			include: {
				choices: true
			}
		});
	} catch (error) {
		console.error('Error creating topic:', error);
		throw error;
	}
}

export async function updateTopic(id: string, data: TopicUpdateRequest) {
	try {
		const updateData: Prisma.TopicUpdateInput = {
			label: data.label,
			description: data.description,
			status: data.status,
			isAnonyme: data.isAnonyme,
			modality: data.modality,
		};

		// Handling choices if they are part of the update request
		if (data.choices){
			updateData["choices"]={
				updateMany: data.choices.map(choice =>({
					where:{id:choice.id},
					data:{...data},
				})),
			};
		}

		return await prisma.topic.update({
			where: { id },
			data: updateData,
			include: {
				choices: true, // Optionally include the updated choices in the returned object
			},
		});
	} catch (error) {
		console.error('Error updating topic:', error);
		throw error;
	}
}