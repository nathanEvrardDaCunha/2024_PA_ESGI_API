"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralAssemblyListValidation = exports.GeneralAssemblyUpdateValidation = exports.GeneralAssemblyValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const topic_validation_1 = require("./topic-validation");
const survey_validation_1 = require("./survey-validation");
// Validation pour la création d'une assemblée générale
exports.GeneralAssemblyValidation = joi_1.default.object({
    meetingDate: joi_1.default.date().required(),
    status: joi_1.default.string().required(),
    outcome: joi_1.default.string().required(),
    creationDate: joi_1.default.date().required(),
    endingDate: joi_1.default.date().required(),
    person: joi_1.default.array().items(joi_1.default.string()).optional(), // Tableau Person
    topics: joi_1.default.array().items(topic_validation_1.TopicValidation).optional(), // Tableau Topic
    surveys: joi_1.default.array().items(survey_validation_1.SurveyValidation).optional(), // Tableau Survey
    activityId: joi_1.default.string().optional(), // ID de l'activité associée (optionnel)
});
// Validation pour la mise à jour d'une assemblée générale
exports.GeneralAssemblyUpdateValidation = joi_1.default.object({
    meetingDate: joi_1.default.date().optional(),
    status: joi_1.default.string().optional(),
    outcome: joi_1.default.string().optional(),
    creationDate: joi_1.default.date().optional(),
    endingDate: joi_1.default.date().optional(),
    person: joi_1.default.array().items(joi_1.default.string()).optional(), // Tableau Person
    topics: joi_1.default.array().items(joi_1.default.string()).optional(), // Tableau Topic
    surveys: joi_1.default.array().items(survey_validation_1.SurveyValidation).optional(), // Tableau Survey
    activityId: joi_1.default.string().optional(), // ID de l'activité associée (optionnel)
});
// Validation pour la liste des assemblées générales
exports.GeneralAssemblyListValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
});
exports.default = {
    GeneralAssemblyValidation: exports.GeneralAssemblyValidation,
    GeneralAssemblyUpdateValidation: exports.GeneralAssemblyUpdateValidation,
    GeneralAssemblyListValidation: exports.GeneralAssemblyListValidation,
};
