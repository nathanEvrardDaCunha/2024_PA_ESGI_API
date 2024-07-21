import Joi from "joi";


export const SessionValidation = Joi.object({
    token: Joi.string().required(),
    expirationDate: Joi.date().required(),
});


export interface SessionRequest {
    token: string;
    expirationDate: Date;
}


export const SessionUpdateValidation = Joi.object({
    token: Joi.string().optional(),
    expirationDate: Joi.date().optional(),
});


export interface SessionUpdateRequest {
    token?: string;
    expirationDate?: Date;
}

export default {
    SessionValidation,
    SessionUpdateValidation,
};
