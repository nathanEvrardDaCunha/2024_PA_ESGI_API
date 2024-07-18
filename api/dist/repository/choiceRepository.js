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
exports.deleteChoice = exports.updateChoice = exports.getChoiceById = exports.getAllChoices = void 0;
const index_1 = require("../index");
function getAllChoices() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.choice.findMany({
                include: {
                    topic: true, // Assume you want to include the related topic details
                    voters: true, // Include the voters related to each choice
                }
            });
        }
        catch (error) {
            console.error('Error fetching choices:', error);
            throw error;
        }
    });
}
exports.getAllChoices = getAllChoices;
function getChoiceById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.choice.findUnique({
                where: { id },
                include: {
                    topic: true,
                    voters: true,
                }
            });
        }
        catch (error) {
            console.error('Error fetching choice by ID:', error);
            throw error;
        }
    });
}
exports.getChoiceById = getChoiceById;
function updateChoice(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.choice.update({
                where: { id },
                data,
            });
        }
        catch (error) {
            console.error('Error updating choice:', error);
            throw error;
        }
    });
}
exports.updateChoice = updateChoice;
function deleteChoice(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.choice.delete({
                where: { id }
            });
        }
        catch (error) {
            console.error('Error deleting choice:', error);
            throw error;
        }
    });
}
exports.deleteChoice = deleteChoice;
