import Joi from "joi";

// Validation pour la création d'un emplacement
export const LocationValidation = Joi.object({
    address: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    type: Joi.string().required(),
    capacity: Joi.number().required(),
    status: Joi.string().required(),
});

// Interface pour la création d'un emplacement
export interface LocationRequest {
    address: string;
    country: string;
    city: string;
    postalCode: string;
    type: string;
    capacity: number;
    status: string;
}

// Validation pour la mise à jour d'un emplacement
export const LocationUpdateValidation = Joi.object({
    address: Joi.string().optional(),
    country: Joi.string().optional(),
    city: Joi.string().optional(),
    postalCode: Joi.string().optional(),
    type: Joi.string().optional(),
    capacity: Joi.number().optional(),
    status: Joi.string().optional(),
});

// Interface pour la mise à jour d'un emplacement
export interface LocationUpdateRequest {
    address?: string;
    country?: string;
    city?: string;
    postalCode?: string;
    type?: string;
    capacity?: number;
    status?: string;
}

// Validation pour la liste des emplacements
export const LocationListValidation = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
});

// Interface pour la liste des emplacements
export interface LocationListRequest {
    page?: number;
    limit?: number;
}

export default {
    LocationValidation,
    LocationUpdateValidation,
    LocationListValidation,
};
