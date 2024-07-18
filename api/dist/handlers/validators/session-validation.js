"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionUpdateValidation = exports.SessionValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation pour la création d'une session
exports.SessionValidation = joi_1.default.object({
    token: joi_1.default.string().required(),
    expirationDate: joi_1.default.date().required(),
});
// Validation pour la mise à jour d'une session
exports.SessionUpdateValidation = joi_1.default.object({
    token: joi_1.default.string().optional(),
    expirationDate: joi_1.default.date().optional(),
});
exports.default = {
    SessionValidation: exports.SessionValidation,
    SessionUpdateValidation: exports.SessionUpdateValidation,
};
