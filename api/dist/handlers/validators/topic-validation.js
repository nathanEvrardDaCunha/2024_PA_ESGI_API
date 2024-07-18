"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicListValidation = exports.TopicUpdateValidation = exports.TopicValidation = void 0;
const joi_1 = __importDefault(require("joi"));
// Supposons que ChoiceValidation soit déjà défini quelque part et importé ici si nécessaire
const choice_validation_1 = require("./choice-validation");
// Validation pour la création d'un sujet avec choix
exports.TopicValidation = joi_1.default.object({
    label: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    status: joi_1.default.string().required(),
    isAnonyme: joi_1.default.boolean().required(),
    modality: joi_1.default.string().required(),
    quorum: joi_1.default.number().optional(),
    totalRounds: joi_1.default.number().optional(),
    choices: joi_1.default.array().items(choice_validation_1.ChoiceValidation).optional() // Ajout des choix comme un tableau optionnel
});
// Validation pour la mise à jour d'un sujet
exports.TopicUpdateValidation = joi_1.default.object({
    label: joi_1.default.string().optional(),
    description: joi_1.default.string().optional(),
    status: joi_1.default.string().optional(),
    isAnonyme: joi_1.default.boolean().optional(),
    modality: joi_1.default.string().optional(),
    choices: joi_1.default.array().items(choice_validation_1.ChoiceValidation).optional() // Ajout des choix pour les mises à jour
});
// Validation pour la liste des sujets
exports.TopicListValidation = joi_1.default.object({
    page: joi_1.default.number().min(1).optional(),
    limit: joi_1.default.number().min(1).optional(),
});
exports.default = {
    TopicValidation: exports.TopicValidation,
    TopicUpdateValidation: exports.TopicUpdateValidation,
    TopicListValidation: exports.TopicListValidation,
};
