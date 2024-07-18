"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationListValidation = exports.LocationUpdateValidation = exports.LocationValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation pour la création d'un emplacement
exports.LocationValidation = joi_1.default.object({
    address: joi_1.default.string().required(),
    country: joi_1.default.string().required(),
    city: joi_1.default.string().required(),
    postalCode: joi_1.default.string().required(),
    type: joi_1.default.string().required(),
    capacity: joi_1.default.number().required(),
    status: joi_1.default.string().required(),
});
// Validation pour la mise à jour d'un emplacement
exports.LocationUpdateValidation = joi_1.default.object({
    address: joi_1.default.string().optional(),
    country: joi_1.default.string().optional(),
    city: joi_1.default.string().optional(),
    postalCode: joi_1.default.string().optional(),
    type: joi_1.default.string().optional(),
    capacity: joi_1.default.number().optional(),
    status: joi_1.default.string().optional(),
});
// Validation pour la liste des emplacements
exports.LocationListValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
});
exports.default = {
    LocationValidation: exports.LocationValidation,
    LocationUpdateValidation: exports.LocationUpdateValidation,
    LocationListValidation: exports.LocationListValidation,
};
