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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteToken = exports.validateToken = exports.generateToken = exports.authenticateUser = void 0;
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const ms_1 = __importDefault(require("ms"));
const prisma = new client_1.PrismaClient();
function authenticateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!token) {
                return res.status(401).json({ error: 'Unauthorized: Token is missing' });
            }
            const session = yield validateToken(token);
            if (!session) {
                return res.status(401).json({ error: 'Unauthorized: Invalid token' });
            }
            req.user = { id: session.personId }; // Ajouter l'ID de l'utilisateur à la requête
            next();
        }
        catch (error) {
            console.error('Erreur lors de l\'authentification :', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.authenticateUser = authenticateUser;
function generateToken(personId) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = (0, uuid_1.v4)();
        yield prisma.session.create({
            data: {
                token,
                expirationDate: new Date(Date.now() + (0, ms_1.default)('1d')),
                personId,
            },
        });
        return token;
    });
}
exports.generateToken = generateToken;
function validateToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingToken = yield prisma.session.findUnique({
            where: { token: token }, // Utiliser 'token' comme clé
        });
        if (!existingToken)
            return null;
        if (existingToken.expirationDate < new Date()) {
            // Supprimer le token expiré
            yield prisma.session.delete({ where: { token: token } });
            return null;
        }
        return { personId: existingToken.personId };
    });
}
exports.validateToken = validateToken;
function deleteToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.session.delete({ where: { token: token } });
    });
}
exports.deleteToken = deleteToken;
