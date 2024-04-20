import express, {Request, Response} from "express";import {	createDonation,	getAllDonation,	getDonationById,	getDonationsByUserId,	updateDonation} from "../repository/donationRepository";const donationRouter = express.Router();donationRouter.get('/', async (req: Request, res: Response) => {	//TODO : Check all argument validation	//TODO : Write the service rules		try {		const donations = await getAllDonation();		res.status(200).json(donations);	} catch (error) {		console.error('Error fetching donations:', error);		res.status(500).json({error: 'Internal Server Error'});	}});donationRouter.get('/:id', async (req: Request, res: Response) => {	//TODO : Check all argument validation	//TODO : Write the service rules		try {		const donation = await getDonationById(req.params.id);		if (!donation) {			return res.status(404).json({ error: 'Donation not found' });		}		res.status(200).json(donation);	} catch (error) {		console.error('Error fetching donation by ID:', error);		res.status(500).json({ error: 'Internal Server Error' });	}});// Route pour récupérer les donations par ID utilisateurdonationRouter.get('/user/:userId', async (req: Request, res: Response) => {	try {		const userId = req.params.userId;		const userDonations = await getDonationsByUserId(userId);		if (userDonations.length === 0) {			return res.status(404).json({ error: 'No donations found for this user' });		}		res.status(200).json(userDonations);	} catch (error) {		console.error('Error fetching donations by user ID:', error);		res.status(500).json({ error: 'Internal Server Error' });	}});donationRouter.post('/', async (req: Request, res: Response) => {	//TODO : Check all argument validation	//TODO : Write the service rules		try {		const newDonation = await createDonation(req.body);		res.status(201).json(newDonation);	} catch (error) {		console.error('Error creating donation:', error);		res.status(500).json({error: 'Internal Server Error'});	}});donationRouter.patch('/:id', async (req: Request, res: Response) => {	// TODO: Check all argument validation	// TODO: Write the service rules		try {		const { id } = req.params;		const updatedDonation = await updateDonation(id, req.body);				if (!updatedDonation) {			return res.status(404).json({ error: 'Donation not found' });		}				res.status(200).json(updatedDonation);	} catch (error) {		console.error('Error updating donation:', error);		res.status(500).json({ error: 'Internal Server Error' });	}});export default donationRouter;