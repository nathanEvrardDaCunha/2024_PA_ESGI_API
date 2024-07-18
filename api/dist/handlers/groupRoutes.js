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
const groupRepository_1 = require("../repository/groupRepository");
const group_validation_1 = require("./validators/group-validation");
const documentRepository_1 = require("../repository/documentRepository");
const groupRouter = express_1.default.Router();
groupRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groups = yield (0, groupRepository_1.getAllGroups)();
        res.status(200).json(groups);
    }
    catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
groupRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const group = yield (0, groupRepository_1.getGroupById)(req.params.id);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.status(200).json(group);
    }
    catch (error) {
        console.error('Error fetching group by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
groupRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = group_validation_1.GroupValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const { name, description, memberIds } = req.body;
        const newGroup = yield (0, groupRepository_1.createGroup)({ name, description, memberIds });
        res.status(201).json(newGroup);
    }
    catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
groupRouter.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = group_validation_1.GroupUpdateValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const { id } = req.params;
        const { name, description, memberIds } = req.body;
        const updatedGroup = yield (0, groupRepository_1.updateGroup)(id, { name, description, memberIds });
        if (!updatedGroup) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.status(200).json(updatedGroup);
    }
    catch (error) {
        console.error('Error updating group:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
groupRouter.post('/:id/documents', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: groupId } = req.params;
    const { documentId, path } = req.body;
    if (!documentId || !path) {
        return res.status(400).json({ error: 'documentId and path are required' });
    }
    try {
        // Appel de la méthode pour créer les PersonDocument
        const createdCount = yield (0, documentRepository_1.createPersonDocumentsFromGroup)(groupId, documentId, path);
        res.status(200).json({ message: `Created ${createdCount} PersonDocument entries.` });
    }
    catch (error) {
        console.error('Error adding document to group:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
groupRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedGroup = yield (0, groupRepository_1.deleteGroupById)(req.params.id);
        if (!deletedGroup) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.sendStatus(204);
    }
    catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = groupRouter;
