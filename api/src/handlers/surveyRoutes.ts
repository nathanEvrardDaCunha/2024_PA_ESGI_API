import express, { Request, Response } from "express";
import {
    createSurvey,
    getSurveyById,
    submitSurveyResponse,
} from "../repository/surveyRepository";
import {prisma} from "../index";

const surveyRouter = express.Router();

surveyRouter.post('/', async (req: Request, res: Response) => {
    try {
        const survey = await createSurvey(req.body);
        res.status(201).json(survey);
    } catch (error) {
        console.error("Error creating survey:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

surveyRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const survey = await getSurveyById(req.params.id);
        if (!survey) {
            return res.status(404).json({ error: 'Survey not found' });
        }
        res.status(200).json(survey);
    } catch (error) {
        console.error("Error fetching survey:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

surveyRouter.post('/response', async (req: Request, res: Response) => {
    try {
        const response = await submitSurveyResponse(req.body);
        res.status(201).json(response);
    } catch (error) {
        console.error("Error submitting survey response:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

surveyRouter.get('/results/:surveyId', async (req: Request, res: Response) => {
    const { surveyId } = req.params;

    try {
        const survey = await prisma.survey.findUnique({
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
    } catch (error) {
        console.error('Error fetching survey results:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default surveyRouter;
