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
exports.updateSession = exports.createSession = exports.getSessionById = exports.getAllSession = void 0;
const index_1 = require("../index");
function getAllSession() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.session.findMany();
        }
        catch (error) {
            console.error('Error fetching sessions:', error);
            throw error;
        }
    });
}
exports.getAllSession = getAllSession;
function getSessionById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.session.findUnique({ where: { id } });
        }
        catch (error) {
            console.error('Error fetching session by ID:', error);
            throw error;
        }
    });
}
exports.getSessionById = getSessionById;
function createSession(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.session.create({ data });
        }
        catch (error) {
            console.error('Error creating session:', error);
            throw error;
        }
    });
}
exports.createSession = createSession;
function updateSession(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.session.update({
                where: { id },
                data,
            });
        }
        catch (error) {
            console.error('Error updating session:', error);
            throw error;
        }
    });
}
exports.updateSession = updateSession;
