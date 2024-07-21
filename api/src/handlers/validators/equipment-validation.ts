import Joi from "joi";


export const EquipmentValidation = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    serialNumber: Joi.string().required(),
    manufacturer: Joi.string().required(),
    degradationState: Joi.string().required(),
    status: Joi.string().required(),
    purchaseDate: Joi.date().required(),
    cost: Joi.number().required(),
});


export interface EquipmentRequest {
    name: string;
    description: string;
    serialNumber: string;
    manufacturer: string;
    degradationState: string;
    status: string;
    purchaseDate: Date;
    cost: number;
}


export const EquipmentUpdateValidation = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    serialNumber: Joi.string().optional(),
    manufacturer: Joi.string().optional(),
    degradationState: Joi.string().optional(),
    status: Joi.string().optional(),
    purchaseDate: Joi.date().optional(),
    cost: Joi.number().optional(),
});


export interface EquipmentUpdateRequest {
    name?: string;
    description?: string;
    serialNumber?: string;
    manufacturer?: string;
    degradationState?: string;
    status?: string;
    purchaseDate?: Date;
    cost?: number;
}


export const EquipmentListValidation = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
});


export interface EquipmentListRequest {
    page?: number;
    limit?: number;
}

export default {
    EquipmentValidation,
    EquipmentUpdateValidation,
    EquipmentListValidation,
};
