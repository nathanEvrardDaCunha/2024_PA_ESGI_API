import Joi from "joi";

import { ChoiceValidation, ChoiceRequest } from "./choice-validation";

export const TopicValidation = Joi.object({
    label: Joi.string().required(),
    description: Joi.string().required(),
    status: Joi.string().required(),
    isAnonyme: Joi.boolean().required(),
    modality: Joi.string().required(),
    quorum: Joi.number().optional(),
    totalRounds: Joi.number().optional(),
    choices: Joi.array().items(ChoiceValidation).optional()
});

export interface TopicRequest {
    label: string;
    description: string;
    status: string;
    isAnonyme: boolean;
    quorum:number;
    currentRound:number;
    totalRounds:number;
    modality: string;
    choices?: ChoiceRequest[];
}

export const TopicUpdateValidation = Joi.object({
    label: Joi.string().optional(),
    description: Joi.string().optional(),
    status: Joi.string().optional(),
    isAnonyme: Joi.boolean().optional(),
    modality: Joi.string().optional(),
    choices: Joi.array().items(ChoiceValidation).optional()
});

export interface TopicUpdateRequest {
    label?: string;
    description?: string;
    status?: string;
    isAnonyme?: boolean;
    modality?: string;
    choices?: ChoiceUpdateRequest[];
}
export interface ChoiceUpdateRequest {
    id?: string;
    description?: string;
}
export const TopicListValidation = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
});

export interface TopicListRequest {
    page?: number;
    limit?: number;
}

export default {
    TopicValidation,
    TopicUpdateValidation,
    TopicListValidation,
};
