"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityListValidation = exports.ActivityUpdateValidation = exports.ActivityValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation pour la création d'une activité
exports.ActivityValidation = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    startDate: joi_1.default.date().required(),
    endDate: joi_1.default.date().required(),
    type: joi_1.default.string().required(),
    status: joi_1.default.string().required(),
    location: joi_1.default.array().items(joi_1.default.string()).optional(), // Tableau Location
    task: joi_1.default.array().items(joi_1.default.string()).optional(), // Tableau Task
    equipment: joi_1.default.array().items(joi_1.default.string()).optional(), // Tableau Equipment
    document: joi_1.default.array().items(joi_1.default.string()).optional(), // Tableau Document
});
// Validation pour la mise à jour d'une activité
exports.ActivityUpdateValidation = joi_1.default.object({
    title: joi_1.default.string().optional(),
    description: joi_1.default.string().optional(),
    startDate: joi_1.default.date().optional(),
    endDate: joi_1.default.date().optional(),
    type: joi_1.default.string().optional(),
    status: joi_1.default.string().optional(),
    location: joi_1.default.array().items(joi_1.default.string()).optional(), // Tableau Location
    task: joi_1.default.array().items(joi_1.default.string()).optional(), // Tableau Task
    equipment: joi_1.default.array().items(joi_1.default.string()).optional(), // Tableau Equipment
    document: joi_1.default.array().items(joi_1.default.string()).optional(), // Tableau Document
});
// Validation pour la liste des activités
exports.ActivityListValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
});
exports.default = {
    ActivityValidation: exports.ActivityValidation,
    ActivityUpdateValidation: exports.ActivityUpdateValidation,
    ActivityListValidation: exports.ActivityListValidation,
};
