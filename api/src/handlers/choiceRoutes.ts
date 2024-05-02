import express, { Request, Response } from "express";
import {
    getAllChoices,
    getChoiceById,
    updateChoice,
    deleteChoice
} from "../repository/choiceRepository";
import { ChoiceRequest, ChoiceUpdateRequest, ChoiceValidation, ChoiceUpdateValidation } from "./validators/choice-validation";
import { generateValidationErrorMessage } from "./validators/generate-validation-message";

const choiceRouter = express.Router();

choiceRouter.get('/', async (req: Request, res: Response) => {
    try {
        const choices = await getAllChoices();
        res.status(200).json(choices);
    } catch (error) {
        console.error('Error fetching choices:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

choiceRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const choice = await getChoiceById(req.params.id);
        if (!choice) {
            return res.status(404).json({ error: 'Choice not found' });
        }
        res.status(200).json(choice);
    } catch (error) {
        console.error('Error fetching choice by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


choiceRouter.put('/:id', async (req: Request, res: Response) => {
    const validationResult = ChoiceUpdateValidation.validate(req.body);
    if (validationResult.error) {
        res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
        return;
    }

    try {
        const { id } = req.params;
        const updateData: ChoiceUpdateRequest = req.body;
        const updatedChoice = await updateChoice(id, updateData);

        if (!updatedChoice) {
            return res.status(404).json({ error: 'Choice not found' });
        }

        res.status(200).json(updatedChoice);
    } catch (error) {
        console.error('Error updating choice:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

choiceRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedChoice = await deleteChoice(id);
        if (!deletedChoice) {
            return res.status(404).json({ error: 'Choice not found' });
        }
        res.status(200).json({ message: 'Choice deleted successfully' });
    } catch (error) {
        console.error('Error deleting choice:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default choiceRouter;