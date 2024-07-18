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
exports.updateTask = exports.createTask = exports.getTaskByPersonId = exports.getTaskById = exports.getAllTask = void 0;
const index_1 = require("../index");
const task_validation_1 = require("../handlers/validators/task-validation");
function getAllTask() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.task.findMany();
        }
        catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    });
}
exports.getAllTask = getAllTask;
function getTaskById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.task.findUnique({ where: { id } });
        }
        catch (error) {
            console.error('Error fetching task by ID:', error);
            throw error;
        }
    });
}
exports.getTaskById = getTaskById;
const getTaskByPersonId = (personId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const person = yield index_1.prisma.person.findUnique({
            where: {
                id: personId,
            },
            include: {
                task: true,
            },
        });
        if (!person) {
            throw new Error('User not found');
        }
        const personTask = person.task;
        return personTask;
    }
    catch (error) {
        // Gérer les erreurs
        throw new Error(`Error fetching task by user ID: ${error}`);
    }
});
exports.getTaskByPersonId = getTaskByPersonId;
function createTask(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newTask = yield index_1.prisma.task.create({
                data: Object.assign(Object.assign({}, data), { person: data.person ? {
                        connect: data.person.map(id => ({ id }))
                    } : undefined })
            });
            return newTask;
        }
        catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    });
}
exports.createTask = createTask;
function updateTask(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = task_validation_1.TaskUpdateValidation.validate(data, { abortEarly: false });
            if (error) {
                throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
            }
            return yield index_1.prisma.task.update({
                where: { id },
                data: Object.assign(Object.assign({}, data), { endDate: data.endDate, person: data.person ? { connect: data.person.map(personId => ({ id: personId })) } : undefined }),
            });
        }
        catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    });
}
exports.updateTask = updateTask;
