import Joi from "joi";

// Validation pour la création d'une tâche
export const TaskValidation = Joi.object({
    title: Joi.string().required(),
    priority: Joi.string().required(),
    status: Joi.string().required(),
    description: Joi.string().required(),
    dueDate: Joi.date().required(),
    type: Joi.string().required(),
});

// Interface pour la création d'une tâche
export interface TaskRequest {
    title: string;
    priority: string;
    status: string;
    description: string;
    dueDate: Date;
    type: string;
}

// Validation pour la mise à jour d'une tâche
export const TaskUpdateValidation = Joi.object({
    title: Joi.string().optional(),
    priority: Joi.string().optional(),
    status: Joi.string().optional(),
    description: Joi.string().optional(),
    dueDate: Joi.date().optional(),
    type: Joi.string().optional(),
});

// Interface pour la mise à jour d'une tâche
export interface TaskUpdateRequest {
    title?: string;
    priority?: string;
    status?: string;
    description?: string;
    dueDate?: Date;
    type?: string;
}

// Validation pour la liste des tâches
export const TaskListValidation = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
});

// Interface pour la liste des tâches
export interface TaskListRequest {
    page?: number;
    limit?: number;
}

export default {
    TaskValidation,
    TaskUpdateValidation,
    TaskListValidation,
};
