"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentListValidation = exports.DocumentUpdateValidation = exports.DocumentValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation pour la création d'un document
exports.DocumentValidation = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    fileUrl: joi_1.default.string().uri().required(),
    type: joi_1.default.string().required(),
    authorId: joi_1.default.string().required(),
    groupIds: joi_1.default.array().items(joi_1.default.string().required()).optional(),
});
// Validation pour la mise à jour d'un document
exports.DocumentUpdateValidation = joi_1.default.object({
    title: joi_1.default.string().optional(),
    description: joi_1.default.string().optional(),
    fileUrl: joi_1.default.string().uri().optional(),
    authorId: joi_1.default.string().optional(),
    groupIds: joi_1.default.array().items(joi_1.default.string().required()).optional(),
});
// Validation pour la liste des documents
exports.DocumentListValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
});
exports.default = {
    DocumentValidation: exports.DocumentValidation,
    DocumentUpdateValidation: exports.DocumentUpdateValidation,
    DocumentListValidation: exports.DocumentListValidation,
};
