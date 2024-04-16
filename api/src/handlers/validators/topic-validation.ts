import Joi from "joi";

// Validation pour la création d'un sujet
export const TopicValidation = Joi.object({
    label: Joi.string().required(),
    description: Joi.string().required(),
    status: Joi.string().required(),
    isAnonyme: Joi.boolean().required(),
    modality: Joi.string().required(),
});

// Interface pour la création d'un sujet
export interface TopicRequest {
    label: string;
    description: string;
    status: string;
    isAnonyme: boolean;
    modality: string;
}

// Validation pour la mise à jour d'un sujet
export const TopicUpdateValidation = Joi.object({
    label: Joi.string().optional(),
    description: Joi.string().optional(),
    status: Joi.string().optional(),
    isAnonyme: Joi.boolean().optional(),
    modality: Joi.string().optional(),
});

// Interface pour la mise à jour d'un sujet
export interface TopicUpdateRequest {
    label?: string;
    description?: string;
    status?: string;
    isAnonyme?: boolean;
    modality?: string;
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
