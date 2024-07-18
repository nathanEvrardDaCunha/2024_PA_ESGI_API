"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentListValidation = exports.EquipmentUpdateValidation = exports.EquipmentValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation pour la création d'un équipement
exports.EquipmentValidation = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    serialNumber: joi_1.default.string().required(),
    manufacturer: joi_1.default.string().required(),
    degradationState: joi_1.default.string().required(),
    status: joi_1.default.string().required(),
    purchaseDate: joi_1.default.date().required(),
    cost: joi_1.default.number().required(),
});
// Validation pour la mise à jour d'un équipement
exports.EquipmentUpdateValidation = joi_1.default.object({
    name: joi_1.default.string().optional(),
    description: joi_1.default.string().optional(),
    serialNumber: joi_1.default.string().optional(),
    manufacturer: joi_1.default.string().optional(),
    degradationState: joi_1.default.string().optional(),
    status: joi_1.default.string().optional(),
    purchaseDate: joi_1.default.date().optional(),
    cost: joi_1.default.number().optional(),
});
// Validation pour la liste des équipements
exports.EquipmentListValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
});
exports.default = {
    EquipmentValidation: exports.EquipmentValidation,
    EquipmentUpdateValidation: exports.EquipmentUpdateValidation,
    EquipmentListValidation: exports.EquipmentListValidation,
};
