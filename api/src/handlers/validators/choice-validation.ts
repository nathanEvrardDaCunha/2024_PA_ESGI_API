import Joi from "joi";

// Validation pour la création d'un choix
export const ChoiceValidation = Joi.object({
    description: Joi.string().required(),
});

// Interface pour la création d'un choix
export interface ChoiceRequest {
    round: number;
    description: string;
    round: number;
}

// Validation pour la mise à jour d'un choix
export const ChoiceUpdateValidation = Joi.object({
    description: Joi.string().optional(),
    topicId: Joi.string().optional(), // Optionnel, permet de changer le sujet lié
});

// Interface pour la mise à jour d'un choix
export interface ChoiceUpdateRequest {
    description?: string;
    topicId?: string;
}

export default {
    ChoiceValidation,
    ChoiceUpdateValidation
};
