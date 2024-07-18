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
const surveyRepository_1 = require("../repository/surveyRepository");
const index_1 = require("../index");
const surveyRouter = express_1.default.Router();
surveyRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const survey = yield (0, surveyRepository_1.createSurvey)(req.body);
        res.status(201).json(survey);
    }
    catch (error) {
        console.error("Error creating survey:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
surveyRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const survey = yield (0, surveyRepository_1.getSurveyById)(req.params.id);
        if (!survey) {
            return res.status(404).json({ error: 'Survey not found' });
        }
        res.status(200).json(survey);
    }
    catch (error) {
        console.error("Error fetching survey:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
surveyRouter.post('/response', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, surveyRepository_1.submitSurveyResponse)(req.body);
        res.status(201).json(response);
    }
    catch (error) {
        console.error("Error submitting survey response:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
surveyRouter.get('/results/:surveyId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { surveyId } = req.params;
    try {
        const survey = yield index_1.prisma.survey.findUnique({
            where: { id: surveyId },
            include: {
                questions: {
                    include: {
                        responses: {
                            include: {
                                respondent: true,
                            },
                        },
                    },
                },
            },
        });
        if (!survey) {
            return res.status(404).json({ error: 'Survey not found' });
        }
        const results = survey.questions.map((question) => ({
            question: question.label,
            responses: question.responses.map((response) => ({
                respondent: response.respondent.firstName + ' ' + response.respondent.lastName,
                answer: response.answer,
            })),
        }));
        res.status(200).json(results);
    }
    catch (error) {
        console.error('Error fetching survey results:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = surveyRouter;
