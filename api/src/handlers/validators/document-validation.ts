import Joi from "joi";

// Validation pour la création d'un document
export const DocumentValidation = Joi.object({
    title: Joi.string().required(),
    creationDate: Joi.date().required(),
    lastModified: Joi.date().optional(),
    type: Joi.string().required(),
    description: Joi.string().required(),
    accessLevel: Joi.string().required(),
    version: Joi.number().required(),
    status: Joi.string().required(),
});

// Interface pour la création d'un document
export interface DocumentRequest {
    title: string;
    creationDate: Date;
    lastModified?: Date;
    type: string;
    description: string;
    accessLevel: string;
    version: number;
    status: string;

}

// Validation pour la mise à jour d'un document
export const DocumentUpdateValidation = Joi.object({
    title: Joi.string().optional(),
    creationDate: Joi.date().optional(),
    lastModified: Joi.date().optional(),
    type: Joi.string().optional(),
    description: Joi.string().optional(),
    accessLevel: Joi.string().optional(),
    version: Joi.number().optional(),
    status: Joi.string().optional(),

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
