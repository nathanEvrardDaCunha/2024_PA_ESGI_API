import Joi from "joi";

export const TaskValidation = Joi.object({
    title: Joi.string().required(),
    priority: Joi.string().required(),
    status: Joi.string().required(),
    description: Joi.string().required(),
    endDate: Joi.date().required(),
    startDate: Joi.date().required(),
    type: Joi.string().required(),
    activityId: Joi.string().required(),
    person: Joi.array().items(Joi.string()).optional(),

});

export interface TaskRequest {
    title: string;
    priority: string;
    status: string;
    description: string;
    endDate: Date;
    startDate: Date;
    type: string;
    activityId: string;
    person?: string[];

}

export const TaskUpdateValidation = Joi.object({
    title: Joi.string().optional(),
    priority: Joi.string().optional(),
    status: Joi.string().optional(),
    description: Joi.string().optional(),
    endDate: Joi.date().optional(),
    startDate: Joi.date().optional(),
    type: Joi.string().optional(),
    person: Joi.array().items(Joi.string()).optional(),

});

export interface TaskUpdateRequest {
    title?: string;
    priority?: string;
    status?: string;
    description?: string;
    endDate?: Date;
    startDate?: Date;
    type?: string;
    person?: string[];

}

export const TaskListValidation = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
});

export interface TaskListRequest {
    page?: number;
    limit?: number;
}

export default {
    TaskValidation,
    TaskUpdateValidation,
    TaskListValidation,
};
