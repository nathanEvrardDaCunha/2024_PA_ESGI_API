import Joi from "joi";
import { TopicValidation, TopicRequest } from "./topic-validation";

// Validation pour la création d'une assemblée générale
export const GeneralAssemblyValidation = Joi.object({
    meetingDate: Joi.date().required(),
    status: Joi.string().required(),
    outcome: Joi.string().required(),
    creationDate: Joi.date().required(),
    endingDate: Joi.date().required(),
    person: Joi.array().items(Joi.string()).optional(), // Tableau Person
    topics: Joi.array().items(TopicValidation).optional(), // Tableau Topic
    activityId: Joi.string().optional(), // ID de l'activité associée (optionnel)
});

// Interface pour la création d'une assemblée générale
export interface GeneralAssemblyRequest {
    meetingDate: Date;
    status: string;
    outcome: string;
    creationDate: Date;
    endingDate: Date;
    person?: string[]; // Tableau Person
    topics?: TopicRequest[]; // Tableau Topic
    activityId?: string;
}

// Validation pour la mise à jour d'une assemblée générale
export const GeneralAssemblyUpdateValidation = Joi.object({
    meetingDate: Joi.date().optional(),
    status: Joi.string().optional(),
    outcome: Joi.string().optional(),
    creationDate: Joi.date().optional(),
    endingDate: Joi.date().optional(),
    person: Joi.array().items(Joi.string()).optional(), // Tableau Person
    topics: Joi.array().items(Joi.string()).optional(), // Tableau Topic
    activityId: Joi.string().optional(), // ID de l'activité associée (optionnel)

});

// Interface pour la mise à jour d'une assemblée générale
export interface GeneralAssemblyUpdateRequest {
    meetingDate?: Date;
    status?: string;
    outcome?: string;
    creationDate?: Date;
    endingDate?: Date;
    person?: string[]; // Tableau Person
    topics?: string[]; // Tableau Topic
    activityId?: string; // ID de l'activité associée (optionnel)

}

// Validation pour la liste des assemblées générales
export const GeneralAssemblyListValidation = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
});

// Interface pour la liste des assemblées générales
export interface GeneralAssemblyListRequest {
    page?: number;
    limit?: number;
}

export default {
    GeneralAssemblyValidation,
    GeneralAssemblyUpdateValidation,
    GeneralAssemblyListValidation,
};
