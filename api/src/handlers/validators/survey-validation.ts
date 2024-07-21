import Joi from 'joi';

export const QuestionValidation = Joi.object({
    label: Joi.string().required(),
    type: Joi.string().valid('TEXT', 'MULTIPLE_CHOICE', 'CHECKBOX').required(),
    options: Joi.array().items(Joi.string()).optional(),
});

export interface QuestionRequest {
    label: string;
    type: 'TEXT' | 'MULTIPLE_CHOICE' | 'CHECKBOX';
    options?: string[];
}

export const SurveyValidation = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    questions: Joi.array().items(QuestionValidation).required(),
});

export interface SurveyRequest {
    title: string;
    description?: string;
    questions: QuestionRequest[];
}

export default {
    SurveyValidation,
};
