"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPersonValidation = exports.PersonListValidation = exports.PersonUpdateValidation = exports.PersonValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation pour la création d'une personne
exports.PersonValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    birthDate: joi_1.default.date().required(),
    phoneNumber: joi_1.default.string().required(),
    role: joi_1.default.string().required(),
});
// Validation pour la mise à jour d'une personne
exports.PersonUpdateValidation = joi_1.default.object({
    email: joi_1.default.string().email().optional(),
    password: joi_1.default.string().optional(),
    firstName: joi_1.default.string().optional(),
    lastName: joi_1.default.string().optional(),
    birthDate: joi_1.default.date().optional(),
    phoneNumber: joi_1.default.string().optional(),
    role: joi_1.default.string().optional(),
});
// Validation pour la liste de personnes
exports.PersonListValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
});
exports.default = {
    PersonValidation: exports.PersonValidation,
    PersonUpdateValidation: exports.PersonUpdateValidation,
    PersonListValidation: exports.PersonListValidation,
};
exports.LoginPersonValidation = joi_1.default.object({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
}).options({ abortEarly: false });
