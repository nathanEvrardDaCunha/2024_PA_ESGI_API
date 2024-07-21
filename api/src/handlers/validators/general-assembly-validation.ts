import Joi from 'joi';
import { TopicValidation, TopicRequest } from './topic-validation';
import { SurveyValidation, SurveyRequest } from './survey-validation';


export const GeneralAssemblyValidation = Joi.object({
    meetingDate: Joi.date().required(),
    status: Joi.string().required(),
    outcome: Joi.string().required(),
    creationDate: Joi.date().required(),
    endingDate: Joi.date().required(),
    person: Joi.array().items(Joi.string()).optional(),
    topics: Joi.array().items(TopicValidation).optional(),
    surveys: Joi.array().items(SurveyValidation).optional(),
    activityId: Joi.string().optional(),
});


export interface GeneralAssemblyRequest {
    meetingDate: Date;
    status: string;
    outcome: string;
    creationDate: Date;
    endingDate: Date;
    person?: string[];
    topics?: TopicRequest[];
    surveys?: SurveyRequest[];
    activityId?: string;
}


export const GeneralAssemblyUpdateValidation = Joi.object({
    meetingDate: Joi.date().optional(),
    status: Joi.string().optional(),
    outcome: Joi.string().optional(),
    creationDate: Joi.date().optional(),
    endingDate: Joi.date().optional(),
    person: Joi.array().items(Joi.string()).optional(),
    topics: Joi.array().items(Joi.string()).optional(),
    surveys: Joi.array().items(SurveyValidation).optional(),
    activityId: Joi.string().optional(),
});


export interface GeneralAssemblyUpdateRequest {
    meetingDate?: Date;
    status?: string;
    outcome?: string;
    creationDate?: Date;
    endingDate?: Date;
    person?: string[];
    topics?: string[];
    surveys?: SurveyRequest[];
    activityId?: string;
}


export const GeneralAssemblyListValidation = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
});


export interface GeneralAssemblyListRequest {
    page?: number;
    limit?: number;
}

export default {
    GeneralAssemblyValidation,
    GeneralAssemblyUpdateValidation,
    GeneralAssemblyListValidation,
};
