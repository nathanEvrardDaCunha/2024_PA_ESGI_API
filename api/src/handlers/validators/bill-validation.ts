import Joi from "joi";

export const BillValidation = Joi.object({
    transactionDate: Joi.date().required(),
    amount: Joi.number().required(),
    description: Joi.string().required(),
    paymentMethod: Joi.string().required(),
});

export interface BillRequest {
    transactionDate: Date;
    amount: number;
    description: string;
    paymentMethod: string;
}

export const BillUpdateValidation = Joi.object({
    transactionDate: Joi.date().optional(),
    amount: Joi.number().optional(),
    description: Joi.string().optional(),
    paymentMethod: Joi.string().optional(),
});

export interface BillUpdateRequest {
    transactionDate?: Date;
    amount?: number;
    description?: string;
    paymentMethod?: string;
}

export const BillListValidation = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
});

export interface BillListRequest {
    page?: number;
    limit?: number;
}

export default {
    BillValidation,
    BillUpdateValidation,
    BillListValidation,
};
