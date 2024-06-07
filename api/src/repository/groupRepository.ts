import { PrismaClient, Prisma } from '@prisma/client';
import {GroupRequest, GroupUpdateRequest} from "../handlers/validators/group-validation";

const prisma = new PrismaClient();

export async function getAllGroups() {
    try {
        return await prisma.group.findMany();
    } catch (error) {
        console.error('Error fetching groups:', error);
        throw error;
    }
}

export async function getGroupById(id: string) {
    try {
        return await prisma.group.findUnique({ where: { id } });
    } catch (error) {
        console.error('Error fetching group by ID:', error);
        throw error;
    }
}

export async function createGroup(data: GroupRequest) {
    try {
        const groupData: Prisma.GroupCreateInput = {
            name: data.name,
            description: data.description,
            members: {
                create: data.memberIds.map(memberId => ({
                    person: { connect: { id: memberId } },
                })),
            },
        };
        return await prisma.group.create({ data: groupData });
    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
}

export async function updateGroup(id: string, data: GroupUpdateRequest) {
    try {
        const updateData: Prisma.GroupUpdateInput = {
            name: data.name,
            description: data.description,
            members: data.memberIds ? {
                set: data.memberIds.map(memberId => ({
                    personId_groupId: {
                        personId: memberId,
                        groupId: id,
                    }
                })),
            } : undefined,
        };
        return await prisma.group.update({
            where: { id },
            data: updateData,
        });
    } catch (error) {
        console.error('Error updating group:', error);
        throw error;
    }
}


export async function deleteGroupById(id: string) {
    try {
        return await prisma.group.delete({ where: { id } });
    } catch (error) {
        console.error('Error deleting group:', error);
        throw error;
    }
}
