import { prisma } from "../index";
import { Prisma } from "@prisma/client";
import { ChoiceRequest, ChoiceUpdateRequest } from "../handlers/validators/choice-validation";

export async function getAllChoices() {
    try {
        return await prisma.choice.findMany({
            include: {
                topic: true,
                voters: true,
            }
        });
    } catch (error) {
        console.error('Error fetching choices:', error);
        throw error;
    }
}

export async function getChoiceById(id: string) {
    try {
        return await prisma.choice.findUnique({
            where: { id },
            include: {
                topic: true,
                voters: true,
            }
        });
    } catch (error) {
        console.error('Error fetching choice by ID:', error);
        throw error;
    }
}



export async function updateChoice(id: string, data: ChoiceUpdateRequest) {
    try {
        return await prisma.choice.update({
            where: { id },
            data,
        });
    } catch (error) {
        console.error('Error updating choice:', error);
        throw error;
    }
}

export async function deleteChoice(id: string) {
    try {
        return await prisma.choice.delete({
            where: { id }
        });
    } catch (error) {
        console.error('Error deleting choice:', error);
        throw error;
    }
}
