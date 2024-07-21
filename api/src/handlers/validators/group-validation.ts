import Joi from 'joi';

export const GroupValidation = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional().allow(''),
    memberIds: Joi.array().items(Joi.string().required()).required(),
});

export interface GroupRequest {
    name: string;
    description?: string;
    memberIds: string[];
}

export const GroupUpdateValidation = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional().allow(''),
    memberIds: Joi.array().items(Joi.string().required()).optional(),
});

export interface GroupUpdateRequest {
    name?: string;
    description?: string;
    memberIds?: string[];
}

export const GroupListValidation = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
});

export interface GroupListRequest {
    page?: number;
    limit?: number;
}

export default {
    GroupValidation,
    GroupUpdateValidation,
    GroupListValidation,
};
