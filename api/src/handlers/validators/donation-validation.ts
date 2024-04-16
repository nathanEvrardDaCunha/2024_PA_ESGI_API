import Joi from "joi";

// Validation pour la création d'un don
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

// Interface pour la création d'un don
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

// Validation pour la mise à jour d'un don
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

// Interface pour la mise à jour d'un don
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

// Validation pour la liste des dons
export const DonationListValidation = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
});

// Interface pour la liste des dons
export interface DonationListRequest {
    page?: number;
    limit?: number;
}

export default {
    DonationValidation,
    DonationUpdateValidation,
    DonationListValidation,
};
