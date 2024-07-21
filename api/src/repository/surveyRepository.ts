import { prisma } from "../index";

export async function createSurvey(data: any) {
    try {
        const survey = await prisma.survey.create({
            data: {
                title: data.title,
                description: data.description,
                assemblyId: data.assemblyId,
                questions: {
                    create: data.questions.map((question: any) => ({
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
    } catch (error) {
        console.error("Error creating survey:", error);
        throw error;
    }
}

export async function getSurveyById(id: string) {
    try {
        return await prisma.survey.findUnique({
            where: { id },
            include: {
                questions: true,
            },
        });
    } catch (error) {
        console.error("Error fetching survey by ID:", error);
        throw error;
    }
}

export async function submitSurveyResponse(data: any) {
    try {

        const response = await prisma.surveyResponse.create({
            data: {
                surveyId: data.surveyId,
                respondentId: data.respondentId,
                answers: {
                    create: data.answers.map((answer: any) => ({
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
                answers: true,
            },
        });
        return response;
    } catch (error) {
        console.error("Error submitting survey response:", error);
        throw error;
    }
}

