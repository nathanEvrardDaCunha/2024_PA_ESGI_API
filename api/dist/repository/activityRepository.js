"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivityByPersonIdViaTask = exports.updateActivity = exports.createActivity = exports.getActivityById = exports.getAllActivity = void 0;
const index_1 = require("../index");
const activity_validation_1 = require("../handlers/validators/activity-validation");
function getAllActivity() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.activity.findMany();
        }
        catch (error) {
            console.error('Error fetching activities:', error);
            throw error;
        }
    });
}
exports.getAllActivity = getAllActivity;
function getActivityById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.activity.findUnique({ where: { id } });
        }
        catch (error) {
            console.error('Error fetching activity by ID:', error);
            throw error;
        }
    });
}
exports.getActivityById = getActivityById;
function createActivity(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.activity.create({ data: Object.assign(Object.assign({}, data), { location: data.location ? { connect: data.location.map((id) => ({ id })) } : undefined, equipment: data.equipment ? { connect: data.equipment.map((id) => ({ id })) } : undefined, task: data.task ? { connect: data.task.map((id) => ({ id })) } : undefined, document: data.document ? { connect: data.document.map((id) => ({ id })) } : undefined })
            });
        }
        catch (error) {
            console.error('Error creating activity:', error);
            throw error;
        }
    });
}
exports.createActivity = createActivity;
function updateActivity(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            validateData(data, activity_validation_1.ActivityUpdateValidation); // Valider les données d'entrée
            return yield index_1.prisma.activity.update({
                where: { id },
                data: Object.assign(Object.assign({}, data), { location: data.location ? { connect: data.location.map((id) => ({ id })) } : undefined, equipment: data.equipment ? { connect: data.equipment.map((id) => ({ id })) } : undefined, task: data.task ? { connect: data.task.map((id) => ({ id })) } : undefined, document: data.document ? { connect: data.document.map((id) => ({ id })) } : undefined }),
            });
        }
        catch (error) {
            console.error('Error updating activity:', error);
            throw error;
        }
    });
}
exports.updateActivity = updateActivity;
function getActivityByPersonIdViaTask(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const activities = yield index_1.prisma.activity.findMany({
            where: {
                task: {
                    some: {
                        person: {
                            some: {
                                id: id
                            }
                        }
                    }
                }
            },
            include: {
                equipment: true,
                document: true,
                location: true
            }
        });
        return activities;
    });
}
exports.getActivityByPersonIdViaTask = getActivityByPersonIdViaTask;
// Fonction pour valider les données avec le schéma Joi
function validateData(data, schema) {
    const { error } = schema.validate(data);
    if (error) {
        throw new Error(error.details[0].message);
    }
}
