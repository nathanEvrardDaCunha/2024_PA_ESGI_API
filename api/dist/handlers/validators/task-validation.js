"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskListValidation = exports.TaskUpdateValidation = exports.TaskValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation pour la création d'une tâche
exports.TaskValidation = joi_1.default.object({
    title: joi_1.default.string().required(),
    priority: joi_1.default.string().required(),
    status: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    endDate: joi_1.default.date().required(),
    startDate: joi_1.default.date().required(),
    type: joi_1.default.string().required(),
    activityId: joi_1.default.string().required(),
    person: joi_1.default.array().items(joi_1.default.string()).optional(), // Tableau Person
});
// Validation pour la mise à jour d'une tâche
exports.TaskUpdateValidation = joi_1.default.object({
    title: joi_1.default.string().optional(),
    priority: joi_1.default.string().optional(),
    status: joi_1.default.string().optional(),
    description: joi_1.default.string().optional(),
    endDate: joi_1.default.date().optional(),
    startDate: joi_1.default.date().optional(),
    type: joi_1.default.string().optional(),
    person: joi_1.default.array().items(joi_1.default.string()).optional(), // Tableau Person
});
// Validation pour la liste des tâches
exports.TaskListValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
});
exports.default = {
    TaskValidation: exports.TaskValidation,
    TaskUpdateValidation: exports.TaskUpdateValidation,
    TaskListValidation: exports.TaskListValidation,
};
