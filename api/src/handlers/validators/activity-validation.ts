import Joi from "joi";

export const ActivityValidation = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    type: Joi.string().required(),
    status: Joi.string().required(),
    location: Joi.array().items(Joi.string()).optional(),
    task: Joi.array().items(Joi.string()).optional(),
    equipment: Joi.array().items(Joi.string()).optional(),
    document: Joi.array().items(Joi.string()).optional(),
});

export interface ActivityRequest {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    type: string;
    status: string;
    location?: string[];
    task?: string[];
    equipment?: string[];
    document?: string[];
}

export const ActivityUpdateValidation = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    type: Joi.string().optional(),
    status: Joi.string().optional(),
    location: Joi.array().items(Joi.string()).optional(),
    task: Joi.array().items(Joi.string()).optional(),
    equipment: Joi.array().items(Joi.string()).optional(),
    document: Joi.array().items(Joi.string()).optional(),
});

export interface ActivityUpdateRequest {
    title?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    type?: string;
    status?: string;
    location?: string[];
    task?: string[];
    equipment?: string[];
    document?: string[];
}

export const ActivityListValidation = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
});

export interface ActivityListRequest {
    page?: number;
    limit?: number;
}

export default {
    ActivityValidation,
    ActivityUpdateValidation,
    ActivityListValidation,
};
