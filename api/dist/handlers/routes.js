"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRoutes = void 0;
const personRoutes_1 = __importDefault(require("./personRoutes"));
const locationRoutes_1 = __importDefault(require("./locationRoutes"));
const membershipRoutes_1 = __importDefault(require("./membershipRoutes"));
const donationsRoutes_1 = __importDefault(require("./donationsRoutes"));
const activityRoutes_1 = __importDefault(require("./activityRoutes"));
const assemblyRoutes_1 = __importDefault(require("./assemblyRoutes"));
const topicRoutes_1 = __importDefault(require("./topicRoutes"));
const documentRoutes_1 = __importDefault(require("./documentRoutes"));
const equipmentRoutes_1 = __importDefault(require("./equipmentRoutes"));
const taskRoutes_1 = __importDefault(require("./taskRoutes"));
const sessionRoutes_1 = __importDefault(require("./sessionRoutes"));
const choiceRoutes_1 = __importDefault(require("./choiceRoutes"));
const groupRoutes_1 = __importDefault(require("./groupRoutes"));
const surveyRoutes_1 = __importDefault(require("./surveyRoutes"));
const chatbotRoutes_1 = __importDefault(require("./chatbotRoutes"));
const initRoutes = (app) => {
    //TODO : Every routes have a personal router. Is it better to just have only one ?
    app.use('/persons', personRoutes_1.default);
    app.use('/locations', locationRoutes_1.default);
    app.use('/chatbot', chatbotRoutes_1.default);
    app.use('/activities', activityRoutes_1.default);
    app.use('/topics', topicRoutes_1.default);
    app.use('/groups', groupRoutes_1.default);
    app.use('/documents', documentRoutes_1.default);
    app.use('/equipments', equipmentRoutes_1.default);
    app.use('/choices', choiceRoutes_1.default);
    app.use('/tasks', taskRoutes_1.default); //Need a activityId
    app.use('/sessions', sessionRoutes_1.default); //Need a personId
    app.use('/memberships', membershipRoutes_1.default); //Need a personId
    app.use('/assemblies', assemblyRoutes_1.default); //Need a activityId
    app.use('/donations', donationsRoutes_1.default); //Need a personId
    app.use('/surveys', surveyRoutes_1.default);
};
exports.initRoutes = initRoutes;
