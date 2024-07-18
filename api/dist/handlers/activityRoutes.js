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
const activityRepository_1 = require("../repository/activityRepository");
const activity_validation_1 = require("./validators/activity-validation");
const activityRouter = express_1.default.Router();
activityRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const activities = yield (0, activityRepository_1.getAllActivity)();
        res.status(200).json(activities);
    }
    catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
activityRouter.get('/person/:personId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const personId = req.params.personId;
        const personActivities = yield (0, activityRepository_1.getActivityByPersonIdViaTask)(personId);
        if (!personActivities) {
            return res.status(404).json({ error: 'No activity found for the user' });
        }
        res.status(200).json(personActivities);
    }
    catch (error) {
        console.error('Error fetching activities by user ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
activityRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    try {
        const activity = yield (0, activityRepository_1.getActivityById)(req.params.id);
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.status(200).json(activity);
    }
    catch (error) {
        console.error('Error fetching activity by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
activityRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO : Check all argument validation
    //TODO : Write the service rules
    const { error, value } = activity_validation_1.ActivityValidation.validate(req.body);
    if (error) {
        // Si les données ne sont pas valides, renvoyez une réponse 400 Bad Request avec le message d'erreur
        return res.status(400).json({ error: error.details[0].message });
    }
    const activityRequest = value;
    try {
        const newActivity = yield (0, activityRepository_1.createActivity)(activityRequest);
        res.status(201).json(newActivity);
    }
    catch (error) {
        console.error('Error creating activity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
activityRouter.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: Check all argument validation
    // TODO: Write the service rules
    try {
        const { id } = req.params;
        const updatedActivity = yield (0, activityRepository_1.updateActivity)(id, req.body);
        if (!updatedActivity) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.status(200).json(updatedActivity);
    }
    catch (error) {
        console.error('Error updating activity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = activityRouter;
