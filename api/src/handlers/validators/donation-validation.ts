import Joi from "joi";

export const DonationValidation = Joi.object({
    status: Joi.string().required(),
    type: Joi.string().required(),
    paymentMethod: Joi.string().required(),
    message: Joi.string().optional(),
    renewalDate: Joi.date().optional(),
    amount: Joi.number().required(),
    transactionDate: Joi.date().required(),
    renewalFrequency: Joi.number().required(),
});

export interface DonationRequest {
    status: string;
    type: string;
    paymentMethod: string;
    message?: string;
    renewalDate?: Date;
    amount: number;
    transactionDate: Date;
    renewalFrequency: number;
}

export const DonationUpdateValidation = Joi.object({
    status: Joi.string().optional(),
    type: Joi.string().optional(),
    paymentMethod: Joi.string().optional(),
    message: Joi.string().optional(),
    renewalDate: Joi.date().optional(),
    amount: Joi.number().optional(),
    transactionDate: Joi.date().optional(),
    renewalFrequency: Joi.number().optional(),
});

export interface DonationUpdateRequest {
    status?: string;
    type?: string;
    paymentMethod?: string;
    message?: string;
    renewalDate?: Date;
    amount?: number;
    transactionDate?: Date;
    renewalFrequency?: number;
}


export const DonationListValidation = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
});


export interface DonationListRequest {
    page?: number;
    limit?: number;
}

export default {
    DonationValidation,
    DonationUpdateValidation,
    DonationListValidation,
};
