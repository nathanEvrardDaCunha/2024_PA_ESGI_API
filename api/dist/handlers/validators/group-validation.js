"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupListValidation = exports.GroupUpdateValidation = exports.GroupValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation pour la création d'un groupe
exports.GroupValidation = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().optional().allow(''),
    memberIds: joi_1.default.array().items(joi_1.default.string().required()).required(),
});
// Validation pour la mise à jour d'un groupe
exports.GroupUpdateValidation = joi_1.default.object({
    name: joi_1.default.string().optional(),
    description: joi_1.default.string().optional().allow(''),
    memberIds: joi_1.default.array().items(joi_1.default.string().required()).optional(),
});
// Validation pour la liste des groupes
exports.GroupListValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
});
exports.default = {
    GroupValidation: exports.GroupValidation,
    GroupUpdateValidation: exports.GroupUpdateValidation,
    GroupListValidation: exports.GroupListValidation,
};
