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
exports.deleteMembershipById = exports.getMembershipsByUserId = exports.updateMembership = exports.createMembership = exports.getMembershipById = exports.getAllMembership = void 0;
const index_1 = require("../index");
function getAllMembership() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.membership.findMany();
        }
        catch (error) {
            console.error('Error fetching memberships:', error);
            throw error;
        }
    });
}
exports.getAllMembership = getAllMembership;
function getMembershipById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.membership.findUnique({ where: { id } });
        }
        catch (error) {
            console.error('Error fetching membership by ID:', error);
            throw error;
        }
    });
}
exports.getMembershipById = getMembershipById;
function createMembership(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.membership.create({ data });
        }
        catch (error) {
            console.log('Error creating membership:', error);
            throw error;
        }
    });
}
exports.createMembership = createMembership;
function updateMembership(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.membership.update({
                where: { id },
                data,
            });
        }
        catch (error) {
            console.error('Error updating membership:', error);
            throw error;
        }
    });
}
exports.updateMembership = updateMembership;
function getMembershipsByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const memberships = yield index_1.prisma.membership.findMany({
                where: {
                    personId: userId,
                },
                include: {
                    person: true,
                },
            });
            return memberships;
        }
        catch (error) {
            console.error('Error fetching memberships by user ID:', error);
            throw error;
        }
    });
}
exports.getMembershipsByUserId = getMembershipsByUserId;
function deleteMembershipById(membershipId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield index_1.prisma.membership.delete({
                where: {
                    id: membershipId,
                },
            });
        }
        catch (error) {
            console.error('Error deleting membership:', error);
            throw error;
        }
    });
}
exports.deleteMembershipById = deleteMembershipById;
