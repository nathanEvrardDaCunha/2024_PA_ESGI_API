import Joi from "joi";

// Validation pour la création d'une activité
export const ActivityValidation = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    type: Joi.string().required(),
    status: Joi.string().required(),
});

// Interface pour la création d'une activité
export interface ActivityRequest {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    type: string;
    status: string;
}

// Validation pour la mise à jour d'une activité
export const ActivityUpdateValidation = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    type: Joi.string().optional(),
    status: Joi.string().optional(),
});

// Interface pour la mise à jour d'une activité
export interface ActivityUpdateRequest {
    title?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    type?: string;
    status?: string;
}

// Validation pour la liste des activités
export const ActivityListValidation = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
});

// Interface pour la liste des activités
export interface ActivityListRequest {
    page?: number;
    limit?: number;
}

export default {
    ActivityValidation,
    ActivityUpdateValidation,
    ActivityListValidation,
};
