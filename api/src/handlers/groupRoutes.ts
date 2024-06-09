import express, { Request, Response } from 'express';
import {
    createGroup,
    deleteGroupById,
    getAllGroups,
    getGroupById,
    updateGroup
} from '../repository/groupRepository';
import { GroupValidation, GroupUpdateValidation } from './validators/group-validation';
import {addDocumentToGroup} from "../repository/documentRepository";

const groupRouter = express.Router();

groupRouter.get('/', async (req: Request, res: Response) => {
    try {
        const groups = await getAllGroups();
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

groupRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const group = await getGroupById(req.params.id);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.status(200).json(group);
    } catch (error) {
        console.error('Error fetching group by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

groupRouter.post('/', async (req: Request, res: Response) => {
    const { error } = GroupValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const { name, description, memberIds } = req.body;
        const newGroup = await createGroup({ name, description, memberIds });
        res.status(201).json(newGroup);
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

groupRouter.patch('/:id', async (req: Request, res: Response) => {
    const { error } = GroupUpdateValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const { id } = req.params;
        const { name, description, memberIds } = req.body;
        const updatedGroup = await updateGroup(id, { name, description, memberIds });
        if (!updatedGroup) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.status(200).json(updatedGroup);
    } catch (error) {
        console.error('Error updating group:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
groupRouter.post('/:id/documents', async (req: Request, res: Response) => {
    const { id: groupId } = req.params;
    const { documentId } = req.body;

    if (!documentId) {
        return res.status(400).json({ error: 'documentId is required' });
    }

    try {
        const updatedGroup = await addDocumentToGroup(groupId, documentId);
        res.status(200).json(updatedGroup);
    } catch (error) {
        console.error('Error adding document to group:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
groupRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deletedGroup = await deleteGroupById(req.params.id);
        if (!deletedGroup) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default groupRouter;
