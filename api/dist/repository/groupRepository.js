"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGroupById = exports.updateGroup = exports.createGroup = exports.getGroupById = exports.getAllGroups = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function getAllGroups() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prisma.group.findMany();
        }
        catch (error) {
            console.error('Error fetching groups:', error);
            throw error;
        }
    });
}
exports.getAllGroups = getAllGroups;
function getGroupById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prisma.group.findUnique({ where: { id } });
        }
        catch (error) {
            console.error('Error fetching group by ID:', error);
            throw error;
        }
    });
}
exports.getGroupById = getGroupById;
function createGroup(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const groupData = {
                name: data.name,
                description: data.description,
                members: {
                    create: data.memberIds.map(memberId => ({
                        person: { connect: { id: memberId } },
                    })),
                },
            };
            return yield prisma.group.create({ data: groupData });
        }
        catch (error) {
            console.error('Error creating group:', error);
            throw error;
        }
    });
}
exports.createGroup = createGroup;
function updateGroup(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updateData = {
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
            return yield prisma.group.update({
                where: { id },
                data: updateData,
            });
        }
        catch (error) {
            console.error('Error updating group:', error);
            throw error;
        }
    });
}
exports.updateGroup = updateGroup;
function deleteGroupById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield prisma.group.delete({ where: { id } });
        }
        catch (error) {
            console.error('Error deleting group:', error);
            throw error;
        }
    });
}
exports.deleteGroupById = deleteGroupById;
