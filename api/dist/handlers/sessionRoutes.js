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
const express_1 = __importDefault(require("express"));
const sessionRepository_1 = require("../repository/sessionRepository");
const sessionRouter = express_1.default.Router();
sessionRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const sessions = yield (0, sessionRepository_1.getAllSession)();
        res.status(200).json(sessions);
    }
    catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
sessionRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const session = yield (0, sessionRepository_1.getSessionById)(req.params.id);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        res.status(200).json(session);
    }
    catch (error) {
        console.error('Error fetching session by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
sessionRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const newSession = yield (0, sessionRepository_1.createSession)(req.body);
        res.status(201).json(newSession);
    }
    catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
sessionRouter.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: Check all argument validation
    // TODO: Write the service rules
    try {
        const { id } = req.params;
        const updatedSession = yield (0, sessionRepository_1.updateSession)(id, req.body);
        if (!updatedSession) {
            return res.status(404).json({ error: 'Session not found' });
        }
        res.status(200).json(updatedSession);
    }
    catch (error) {
        console.error('Error updating session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = sessionRouter;
