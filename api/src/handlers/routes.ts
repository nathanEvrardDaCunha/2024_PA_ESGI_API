import express from "express";
import personRouter from './personRoutes';
import locationRouter from "./locationRoutes";
import membershipRouter from "./membershipRoutes";
import donationRouter from "./donationsRoutes";
import activityRouter from "./activityRoutes";
import assemblyRouter from "./assemblyRoutes";
import topicRouter from "./topicRoutes";
import documentRouter from "./documentRoutes";
import equipmentRouter from "./equipmentRoutes";
import taskRouter from "./taskRoutes";
import sessionRouter from "./sessionRoutes";
import choiceRouter from "./choiceRoutes";
import groupRouter from "./groupRoutes";
import surveyRouter from "./surveyRoutes";
import chatbotRouter from "./chatbotRoutes";


export const initRoutes = (app: express.Express) => {
	

	app.use('/persons', personRouter);
	app.use('/locations', locationRouter);
	app.use('/chatbot', chatbotRouter);
	app.use('/activities', activityRouter);
	app.use('/topics', topicRouter);
	app.use('/groups', groupRouter);
	app.use('/documents', documentRouter);
	app.use('/equipments', equipmentRouter);
	app.use('/choices', choiceRouter);
	app.use('/tasks', taskRouter);
	app.use('/sessions', sessionRouter);
	app.use('/memberships', membershipRouter);
	app.use('/assemblies', assemblyRouter);
	app.use('/donations', donationRouter);
	app.use('/surveys', surveyRouter);
	
};