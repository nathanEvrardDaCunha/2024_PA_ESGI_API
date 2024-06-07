import Joi from "joi";

// Supposons que ChoiceValidation soit déjà défini quelque part et importé ici si nécessaire
import { ChoiceValidation, ChoiceRequest } from "./choice-validation";

// Validation pour la création d'un sujet avec choix
export const TopicValidation = Joi.object({
    label: Joi.string().required(),
    description: Joi.string().required(),
    status: Joi.string().required(),
    isAnonyme: Joi.boolean().required(),
    modality: Joi.string().required(),
    choices: Joi.array().items(ChoiceValidation).optional() // Ajout des choix comme un tableau optionnel
});

// Interface pour la création d'un sujet avec choix
export interface TopicRequest {
    label: string;
    description: string;
    status: string;
    isAnonyme: boolean;
    quorum:number;
    modality: string;
    choices?: ChoiceRequest[]; // Tableau de choix
}

// Validation pour la mise à jour d'un sujet
export const TopicUpdateValidation = Joi.object({
    label: Joi.string().optional(),
    description: Joi.string().optional(),
    status: Joi.string().optional(),
    isAnonyme: Joi.boolean().optional(),
    modality: Joi.string().optional(),
    choices: Joi.array().items(ChoiceValidation).optional() // Ajout des choix pour les mises à jour
});

// Interface pour la mise à jour d'un sujet
export interface TopicUpdateRequest {
    label?: string;
    description?: string;
    status?: string;
    isAnonyme?: boolean;
    modality?: string;
    choices?: ChoiceUpdateRequest[]; // Tableau de choix
}
export interface ChoiceUpdateRequest {
    id?: string; // Include if updating an existing choice
    description?: string;
    // Ensure no topicId as it should be managed at the topic level
}
// Validation pour la liste des sujets
export const TopicListValidation = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
});

// Interface pour la liste des sujets
export interface TopicListRequest {
    page?: number;
    limit?: number;
}

export default {
    TopicValidation,
    TopicUpdateValidation,
    TopicListValidation,
};
