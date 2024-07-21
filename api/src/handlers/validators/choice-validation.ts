import Joi from "joi";

export const ChoiceValidation = Joi.object({
    description: Joi.string().required(),
});

export interface ChoiceRequest {
    round: number;
    description: string;

}

export const ChoiceUpdateValidation = Joi.object({
    description: Joi.string().optional(),
    topicId: Joi.string().optional(),
});

export interface ChoiceUpdateRequest {
    description?: string;
    topicId?: string;
}

export default {
    ChoiceValidation,
    ChoiceUpdateValidation
};
