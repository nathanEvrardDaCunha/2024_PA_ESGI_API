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
const choiceRepository_1 = require("../repository/choiceRepository");
const choice_validation_1 = require("./validators/choice-validation");
const generate_validation_message_1 = require("./validators/generate-validation-message");
const choiceRouter = express_1.default.Router();
choiceRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const choices = yield (0, choiceRepository_1.getAllChoices)();
        res.status(200).json(choices);
    }
    catch (error) {
        console.error('Error fetching choices:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
choiceRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const choice = yield (0, choiceRepository_1.getChoiceById)(req.params.id);
        if (!choice) {
            return res.status(404).json({ error: 'Choice not found' });
        }
        res.status(200).json(choice);
    }
    catch (error) {
        console.error('Error fetching choice by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
choiceRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validationResult = choice_validation_1.ChoiceUpdateValidation.validate(req.body);
    if (validationResult.error) {
        res.status(400).send((0, generate_validation_message_1.generateValidationErrorMessage)(validationResult.error.details));
        return;
    }
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedChoice = yield (0, choiceRepository_1.updateChoice)(id, updateData);
        if (!updatedChoice) {
            return res.status(404).json({ error: 'Choice not found' });
        }
        res.status(200).json(updatedChoice);
    }
    catch (error) {
        console.error('Error updating choice:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
choiceRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedChoice = yield (0, choiceRepository_1.deleteChoice)(id);
        if (!deletedChoice) {
            return res.status(404).json({ error: 'Choice not found' });
        }
        res.status(200).json({ message: 'Choice deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting choice:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = choiceRouter;
