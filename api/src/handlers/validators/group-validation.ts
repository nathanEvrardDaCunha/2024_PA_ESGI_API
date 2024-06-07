import Joi from 'joi';

// Validation pour la création d'un groupe
export const GroupValidation = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional().allow(''),
    memberIds: Joi.array().items(Joi.string().required()).required(),
});

// Interface pour la création d'un groupe
export interface GroupRequest {
    name: string;
    description?: string;
    memberIds: string[];
}

// Validation pour la mise à jour d'un groupe
export const GroupUpdateValidation = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional().allow(''),
    memberIds: Joi.array().items(Joi.string().required()).optional(),
});

// Interface pour la mise à jour d'un groupe
export interface GroupUpdateRequest {
    name?: string;
    description?: string;
    memberIds?: string[];
}

// Validation pour la liste des groupes
export const GroupListValidation = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
});

// Interface pour la liste des groupes
export interface GroupListRequest {
    page?: number;
    limit?: number;
}

export default {
    GroupValidation,
    GroupUpdateValidation,
    GroupListValidation,
};
