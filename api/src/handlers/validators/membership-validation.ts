import Joi from "joi";


export const MembershipValidation = Joi.object({
    joinDate: Joi.date().required(),
    status: Joi.string().required(),
    expiryDate: Joi.date().required(),
    accessLevel: Joi.string().required(),
    fees: Joi.number().required(),
    renewalDate: Joi.date().optional(),
    type: Joi.string().required(),
    paymentMethod: Joi.string().required(),
    renewalFrequency: Joi.number().required(),
});


export interface MembershipRequest {
    joinDate: Date;
    status: string;
    expiryDate: Date;
    accessLevel: string;
    fees: number;
    renewalDate?: Date;
    type: string;
    paymentMethod: string;
    renewalFrequency: number;
}


export const MembershipUpdateValidation = Joi.object({
    joinDate: Joi.date().optional(),
    status: Joi.string().optional(),
    expiryDate: Joi.date().optional(),
    accessLevel: Joi.string().optional(),
    fees: Joi.number().optional(),
    renewalDate: Joi.date().optional(),
    type: Joi.string().optional(),
    paymentMethod: Joi.string().optional(),
    renewalFrequency: Joi.number().optional(),
});


export interface MembershipUpdateRequest {
    joinDate?: Date;
    status?: string;
    expiryDate?: Date;
    accessLevel?: string;
    fees?: number;
    renewalDate?: Date;
    type?: string;
    paymentMethod?: string;
    renewalFrequency?: number;
}


export const MembershipListValidation = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
});


export interface MembershipListRequest {
    page?: number;
    limit?: number;
}

export default {
    MembershipValidation,
    MembershipUpdateValidation,
    MembershipListValidation,
};
