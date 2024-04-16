import Joi from "joi";

// Validation pour la création d'une assemblée générale
export const GeneralAssemblyValidation = Joi.object({
    meetingDate: Joi.date().required(),
    status: Joi.string().required(),
    outcome: Joi.string().required(),
    creationDate: Joi.date().required(),
    endingDate: Joi.date().required(),
});

// Interface pour la création d'une assemblée générale
export interface GeneralAssemblyRequest {
    meetingDate: Date;
    status: string;
    outcome: string;
    creationDate: Date;
    endingDate: Date;
}

// Validation pour la mise à jour d'une assemblée générale
export const GeneralAssemblyUpdateValidation = Joi.object({
    meetingDate: Joi.date().optional(),
    status: Joi.string().optional(),
    outcome: Joi.string().optional(),
    creationDate: Joi.date().optional(),
    endingDate: Joi.date().optional(),
});

// Interface pour la mise à jour d'une assemblée générale
export interface GeneralAssemblyUpdateRequest {
    meetingDate?: Date;
    status?: string;
    outcome?: string;
    creationDate?: Date;
    endingDate?: Date;
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
