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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskRepository_1 = require("../repository/taskRepository");
const task_validation_1 = require("./validators/task-validation");
const taskRouter = express_1.default.Router();
taskRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const tasks = yield (0, taskRepository_1.getAllTask)();
        res.status(200).json(tasks);
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
taskRouter.get('/person/:personId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const personId = req.params.personId;
        const personTasks = yield (0, taskRepository_1.getTaskByPersonId)(personId);
        if (!personTasks) {
            return res.status(404).json({ error: 'No task found for the user' });
        }
        res.status(200).json(personTasks);
    }
    catch (error) {
        console.error('Error fetching tasks by user ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
taskRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const task = yield (0, taskRepository_1.getTaskById)(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(task);
    }
    catch (error) {
        console.error('Error fetching task by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
taskRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const { error, value } = task_validation_1.TaskValidation.validate(req.body);
        if (error) {
            // Si les données ne sont pas valides, renvoyez une réponse 400 Bad Request avec le message d'erreur
            return res.status(400).json({ error: error.details[0].message });
        }
        const taskRequest = value;
        const newTask = yield (0, taskRepository_1.createTask)(taskRequest);
        res.status(201).json(newTask);
    }
    catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
taskRouter.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: Check all argument validation
    // TODO: Write the service rules
    try {
        const { error, value } = task_validation_1.TaskUpdateValidation.validate(req.body);
        if (error) {
            // Si les données ne sont pas valides, renvoyez une réponse 400 Bad Request avec le message d'erreur
            return res.status(400).json({ error: error.details[0].message });
        }
        const { id } = req.params;
        const updatedTask = yield (0, taskRepository_1.updateTask)(id, req.body);
        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(updatedTask);
    }
    catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = taskRouter;
