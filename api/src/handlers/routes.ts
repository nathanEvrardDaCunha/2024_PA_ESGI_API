import express from "express";
import personRouter from './personRoutes';
import locationRouter from "./locationRoutes";
import membershipRouter from "./membershipRoutes";
import billRouter from "./billRoutes";
import donationRouter from "./donationsRoutes";
import activityRouter from "./activityRoutes";
import assemblyRouter from "./assemblyRoutes";
import topicRouter from "./topicRoutes";
import documentRouter from "./documentRoutes";
import equipmentRouter from "./equipmentRoutes";
import taskRouter from "./taskRoutes";
import sessionRouter from "./sessionRoutes";
import choiceRouter from "./choiceRoutes";


export const initRoutes = (app: express.Express) => {
	
	//TODO : Every routes have a personal router. Is it better to just have only one ?
	
	app.use('/persons', personRouter);
	app.use('/locations', locationRouter);
	
	app.use('/bills', billRouter);
	app.use('/activities', activityRouter);
	app.use('/topics', topicRouter);
	app.use('/documents', documentRouter);
	app.use('/equipments', equipmentRouter);
	app.use('/choices', choiceRouter);
	app.use('/tasks', taskRouter);              //Need a activityId
	app.use('/sessions', sessionRouter);        //Need a personId
	app.use('/memberships', membershipRouter);  //Need a personId
	app.use('/assemblies', assemblyRouter);     //Need a activityId
	app.use('/donations', donationRouter);      //Need a personId
	
};