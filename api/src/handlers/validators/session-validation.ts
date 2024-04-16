import Joi from "joi";

// Validation pour la création d'une session
export const SessionValidation = Joi.object({
    token: Joi.string().required(),
    expirationDate: Joi.date().required(),
});

// Interface pour la création d'une session
export interface SessionRequest {
    token: string;
    expirationDate: Date;
}

// Validation pour la mise à jour d'une session
export const SessionUpdateValidation = Joi.object({
    token: Joi.string().optional(),
    expirationDate: Joi.date().optional(),
});

// Interface pour la mise à jour d'une session
export interface SessionUpdateRequest {
    token?: string;
    expirationDate?: Date;
}

export default {
    SessionValidation,
    SessionUpdateValidation,
};
