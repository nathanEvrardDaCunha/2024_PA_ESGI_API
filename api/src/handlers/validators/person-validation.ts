import Joi from "joi";

export const PersonValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    birthDate: Joi.date().required(),
    phoneNumber: Joi.string().required(),
    role: Joi.string().required(),
});

export interface PersonRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    phoneNumber: string;
    role: string;
}

export const PersonUpdateValidation = Joi.object({
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    birthDate: Joi.date().optional(),
    phoneNumber: Joi.string().optional(),
    role: Joi.string().optional(),
});

export interface PersonUpdateRequest {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    birthDate?: Date;
    phoneNumber?: string;
    role?: string;
}

export const PersonListValidation = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
});

export interface PersonListRequest {
    page?: number;
    limit?: number;
}

export default {
    PersonValidation,
    PersonUpdateValidation,
    PersonListValidation,
};
export const LoginPersonValidation = Joi.object<LoginPersonRequest>({
    email: Joi.string().required(),
    password: Joi.string().required(),
}).options({ abortEarly: false });

export interface LoginPersonRequest {
    email: string;
    password: string;
}