import express, {Request, Response} from "express";
import {createPerson, getAllPerson} from "../repository/personRepository";
import {getAllMembership} from "../repository/membershipRepository";
import {getAllBill} from "../repository/billRepository";
import {getAllDonation} from "../repository/donationRepository";
import {getAllAssembly} from "../repository/assemblyRepository";
import {getAllTopic} from "../repository/topicRepository";
import {getAllDocument} from "../repository/documentRepository";
import {getAllEquipment} from "../repository/equipmentsRepository";
import {getAllTask} from "../repository/taskRepository";
import {createLocation, doesLocationExist, getAllLocation} from "../repository/locationsRepository";
import {getAllSession} from "../repository/sessionRepository";
import {prisma} from "../index";
import personRouter from './personRoutes';
import locationRouter from "./locationRoutes";
import membershipRouter from "./membershipRoutes";
import billRouter from "./billRoutes";
import donationRouter from "./donationsRoutes";
import activityRouter from "./activityRoutes";
import assemblyRouter from "./assemblyRoutes";
import topicRouter from "./topicRoutes";


export const initRoutes = (app: express.Express) => {
	
	app.use('/persons', personRouter);
	app.use('/locations', locationRouter);
	
	app.use('/memberships', membershipRouter); //Need a personId
	app.use('/bills', billRouter);
	app.use('/donations', donationRouter); //Need a personId
	app.use('/activities', activityRouter);
	app.use('/assemblies', assemblyRouter); //Need a activityId
	app.use('/topics', topicRouter);
	
	app.get("/documents", async (req: Request, res: Response) => {
		//Do the validation
		
		//Do the error returning if necessary
		
		//Do services rules
		
		//Do the database queries
		try {
			const documents = await getAllDocument();
			res.status(200).json(documents);
		} catch (error) {
			console.error('Error fetching documents:', error);
			res.status(500).json({error: 'Internal Server Error'});
		}
	});
	
	app.get("/equipments", async (req: Request, res: Response) => {
		//Do the validation
		
		//Do the error returning if necessary
		
		//Do services rules
		
		//Do the database queries
		try {
			const equipments = await getAllEquipment();
			res.status(200).json(equipments);
		} catch (error) {
			console.error('Error fetching equipments:', error);
			res.status(500).json({error: 'Internal Server Error'});
		}
	});
	
	app.get("/tasks", async (req: Request, res: Response) => {
		//Do the validation
		
		//Do the error returning if necessary
		
		//Do services rules
		
		//Do the database queries
		try {
			const tasks = await getAllTask();
			res.status(200).json(tasks);
		} catch (error) {
			console.error('Error fetching tasks:', error);
			res.status(500).json({error: 'Internal Server Error'});
		}
	});
	
	
	app.get("/sessions", async (req: Request, res: Response) => {
		//Do the validation
		
		//Do the error returning if necessary
		
		//Do services rules
		
		//Do the database queries
		try {
			const sessions = await getAllSession();
			res.status(200).json(sessions);
		} catch (error) {
			console.error('Error fetching sessions:', error);
			res.status(500).json({error: 'Internal Server Error'});
		}
	});
};