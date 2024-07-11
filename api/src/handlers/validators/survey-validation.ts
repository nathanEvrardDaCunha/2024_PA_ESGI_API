import Joi from 'joi';

// Validation pour une question du sondage
export const QuestionValidation = Joi.object({
    label: Joi.string().required(),
    type: Joi.string().valid('TEXT', 'MULTIPLE_CHOICE', 'CHECKBOX').required(),
    options: Joi.array().items(Joi.string()).optional(),
});

// Interface pour une question du sondage
export interface QuestionRequest {
    label: string;
    type: 'TEXT' | 'MULTIPLE_CHOICE' | 'CHECKBOX';
    options?: string[];
}

// Validation pour la création d'un sondage
export const SurveyValidation = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    questions: Joi.array().items(QuestionValidation).required(),
});

// Interface pour la création d'un sondage
export interface SurveyRequest {
    title: string;
    description?: string;
    questions: QuestionRequest[];
}

export default {
    SurveyValidation,
};
