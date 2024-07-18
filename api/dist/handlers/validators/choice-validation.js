"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChoiceUpdateValidation = exports.ChoiceValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation pour la création d'un choix
exports.ChoiceValidation = joi_1.default.object({
    description: joi_1.default.string().required(),
});
// Validation pour la mise à jour d'un choix
exports.ChoiceUpdateValidation = joi_1.default.object({
    description: joi_1.default.string().optional(),
    topicId: joi_1.default.string().optional(), // Optionnel, permet de changer le sujet lié
});
exports.default = {
    ChoiceValidation: exports.ChoiceValidation,
    ChoiceUpdateValidation: exports.ChoiceUpdateValidation
};
