import Joi from "joi";

// Validation pour la création d'un document
export const DocumentValidation = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    fileUrl: Joi.string().uri().required(),
    type: Joi.string().required(),
    authorId: Joi.string().required(),
    groupIds: Joi.array().items(Joi.string().required()).optional(),
});

// Interface pour la création d'un document
export interface DocumentRequest {
    title: string;
    description: string;
    fileUrl: string;
    type: string;
    authorId: string;
    groupIds?: string[];
}

// Validation pour la mise à jour d'un document
export const DocumentUpdateValidation = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    fileUrl: Joi.string().uri().optional(),
    authorId: Joi.string().optional(),
    groupIds: Joi.array().items(Joi.string().required()).optional(),
});

// Interface pour la mise à jour d'un document
export interface DocumentUpdateRequest {
    title?: string;
    creationDate?: Date;
    lastModified?: Date;
    type?: string;
    description?: string;
    accessLevel?: string;
    version?: number;
    status?: string;
    fileUrl?: string;
    authorId?: string;
    groupIds?: string[];
}

// Validation pour la liste des documents
export const DocumentListValidation = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
});

// Interface pour la liste des documents
export interface DocumentListRequest {
    page?: number;
    limit?: number;
}

export default {
    DocumentValidation,
    DocumentUpdateValidation,
    DocumentListValidation,
};
