import express, {Request, Response} from "express";import {	createLocation,	getAllLocation,	getLocationById, getLocationByPersonId,	updateLocation, updateLocationByPersonId,	findLocationByUserId, createBusinessLocation, isLocationUsed, deleteLocation} from "../repository/locationsRepository";import {Prisma} from "@prisma/client";import locationValidation, {	LocationUpdateRequest,	LocationUpdateValidation,	LocationValidation} from "./validators/location-validation";import {PersonValidation} from "./validators/person-validation";import {generateValidationErrorMessage} from "./validators/generate-validation-message";import {prisma} from "../index";const locationRouter = express.Router();locationRouter.get('/', async (req: Request, res: Response) => {		try {		const locations = await getAllLocation();		res.status(200).json(locations);	} catch (error) {		console.error('Error fetching locations:', error);		res.status(500).json({error: 'Internal Server Error'});	}});locationRouter.get('/:id', async (req: Request, res: Response) => {		try {		const location = await getLocationById(req.params.id);		if (!location) {			return res.status(404).json({ error: 'Location not found' });		}		res.status(200).json(location);	} catch (error) {		console.error('Error fetching location by ID:', error);		res.status(500).json({ error: 'Internal Server Error' });	}});locationRouter.get('/person/:personId', async (req: Request, res: Response) => {	try {		const personId = req.params.personId;		const personLocations = await getLocationByPersonId(personId);		if (!personLocations ) {			return res.status(404).json({ error: 'No locations found for the user' });		}		res.status(200).json(personLocations);	} catch (error) {		console.error('Error fetching locations by user ID:', error);		res.status(500).json({ error: 'Internal Server Error' });	}});locationRouter.patch('/person/:personId', async (req: Request, res: Response) => {	try {		const validationResult = LocationUpdateValidation.validate(req.body);		if (validationResult.error) {			res.status(400).send(generateValidationErrorMessage(validationResult.error.details));			return;		}		const personId = req.params.personId;		const updateData:LocationUpdateRequest=req.body;		const updatedLocation=updateLocationByPersonId(personId,updateData);		if (!updatedLocation) {			return res.status(404).json({ error: 'Person not found' });		}		res.status(200).json(updatedLocation);	} catch (error) {		console.error('Error updating user location:', error);		res.status(500).json({ error: 'Internal Server Error' });	}});locationRouter.post('/user', async (req: Request, res: Response) => {	try {		const email = req.body.email;		const locationData = {			address: req.body.address,			country: req.body.country,			city: req.body.city,			postalCode: req.body.postalCode,			type: req.body.type,			capacity: req.body.capacity,			status: req.body.status,		};				const newLocation = await createLocation(locationData, email);		res.status(201).json(newLocation);	} catch (error) {		console.error('Error creating locations:', error);		res.status(500).json({ error: 'Internal Server Error' });	}});locationRouter.patch('/:userId', async (req: Request, res: Response) => {	const { userId } = req.params;	const updatedLocation = req.body;		try {		const location = await findLocationByUserId(userId);				if (!location) {			return res.status(404).json({ error: 'Location not found' });		}				const updatedLocationData = await prisma.location.update({			where: {				id: location.id,			},			data: updatedLocation,		});				res.status(200).json(updatedLocationData);	} catch (error) {		console.error('Error updating location:', error);		res.status(500).json({ error: 'Internal Server Error' });	}});locationRouter.post('/business', async (req: Request, res: Response) => {	try {		const locationData = {			address: req.body.address,			country: req.body.country,			city: req.body.city,			postalCode: req.body.postalCode,			type: req.body.type,			capacity: req.body.capacity,			status: req.body.status,		};				const newLocation = await createBusinessLocation(locationData);		res.status(201).json(newLocation);	} catch (error) {		console.error('Error creating business location:', error);		res.status(500).json({ error: 'Internal Server Error' });	}});locationRouter.delete('/location/:id', async (req: Request, res: Response) => {	try {		const locationId = req.params.id;				const isUsed = await isLocationUsed(locationId);				if (isUsed) {			return res.status(400).json({ error: 'Cannot delete location as it is still in use' });		}				await deleteLocation(locationId);				res.status(200).json({ message: 'Location deleted successfully' });	} catch (error) {		console.error('Error deleting location:', error);		res.status(500).json({ error: 'Internal Server Error' });	}});export default locationRouter;