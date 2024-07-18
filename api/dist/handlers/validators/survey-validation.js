"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyValidation = exports.QuestionValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation pour une question du sondage
exports.QuestionValidation = joi_1.default.object({
    label: joi_1.default.string().required(),
    type: joi_1.default.string().valid('TEXT', 'MULTIPLE_CHOICE', 'CHECKBOX').required(),
    options: joi_1.default.array().items(joi_1.default.string()).optional(),
});
// Validation pour la création d'un sondage
exports.SurveyValidation = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().optional(),
    questions: joi_1.default.array().items(exports.QuestionValidation).required(),
});
exports.default = {
    SurveyValidation: exports.SurveyValidation,
};
