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
exports.submitSurveyResponse = exports.getSurveyById = exports.createSurvey = void 0;
const index_1 = require("../index");
function createSurvey(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const survey = yield index_1.prisma.survey.create({
                data: {
                    title: data.title,
                    description: data.description,
                    assemblyId: data.assemblyId,
                    questions: {
                        create: data.questions.map((question) => ({
                            label: question.label,
                            type: question.type,
                            options: question.options,
                        })),
                    },
                },
                include: {
                    questions: true,
                },
            });
            return survey;
        }
        catch (error) {
            console.error("Error creating survey:", error);
            throw error;
        }
    });
}
exports.createSurvey = createSurvey;
function getSurveyById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield index_1.prisma.survey.findUnique({
                where: { id },
                include: {
                    questions: true,
                },
            });
        }
        catch (error) {
            console.error("Error fetching survey by ID:", error);
            throw error;
        }
    });
}
exports.getSurveyById = getSurveyById;
function submitSurveyResponse(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Créez la réponse au sondage avec les réponses associées
            const response = yield index_1.prisma.surveyResponse.create({
                data: {
                    surveyId: data.surveyId,
                    respondentId: data.respondentId,
                    answers: {
                        create: data.answers.map((answer) => ({
                            answer: answer.answer,
                            question: {
                                connect: {
                                    id: answer.questionId
                                }
                            },
                            respondent: {
                                connect: {
                                    id: data.respondentId
                                }
                            }
                        })),
                    },
                },
                include: {
                    answers: true, // Inclure les réponses dans le retour
                },
            });
            return response;
        }
        catch (error) {
            console.error("Error submitting survey response:", error);
            throw error;
        }
    });
}
exports.submitSurveyResponse = submitSurveyResponse;
