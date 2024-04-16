import Joi from "joi";

// Validation pour la création d'une facture
export const BillValidation = Joi.object({
    transactionDate: Joi.date().required(),
    amount: Joi.number().required(),
    description: Joi.string().required(),
    paymentMethod: Joi.string().required(),
});

// Interface pour la création d'une facture
export interface BillRequest {
    transactionDate: Date;
    amount: number;
    description: string;
    paymentMethod: string;
}

// Validation pour la mise à jour d'une facture
export const BillUpdateValidation = Joi.object({
    transactionDate: Joi.date().optional(),
    amount: Joi.number().optional(),
    description: Joi.string().optional(),
    paymentMethod: Joi.string().optional(),
});

// Interface pour la mise à jour d'une facture
export interface BillUpdateRequest {
    transactionDate?: Date;
    amount?: number;
    description?: string;
    paymentMethod?: string;
}

// Validation pour la liste des factures
export const BillListValidation = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
});

// Interface pour la liste des factures
export interface BillListRequest {
    page?: number;
    limit?: number;
}

export default {
    BillValidation,
    BillUpdateValidation,
    BillListValidation,
};
