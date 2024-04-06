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


export const initRoutes = (app: express.Express) => {
	
	app.use('/persons', personRouter);
	app.use('/locations', locationRouter);
	app.use('/memberships', membershipRouter);
	
	
	app.get("/bills", async (req: Request, res: Response) => {
		//Do the validation
		
		//Do the error returning if necessary
		
		//Do services rules
		
		//Do the database queries
		try {
			const bills = await getAllBill();
			res.status(200).json(bills);
		} catch (error) {
			console.error('Error fetching bills:', error);
			res.status(500).json({error: 'Internal Server Error'});
		}
	});
	
	app.get("/donations", async (req: Request, res: Response) => {
		//Do the validation
		
		//Do the error returning if necessary
		
		//Do services rules
		
		//Do the database queries
		try {
			const donations = await getAllDonation();
			res.status(200).json(donations);
		} catch (error) {
			console.error('Error fetching donations:', error);
			res.status(500).json({error: 'Internal Server Error'});
		}
	});
	
	app.get("/assemblies", async (req: Request, res: Response) => {
		//Do the validation
		
		//Do the error returning if necessary
		
		//Do services rules
		
		//Do the database queries
		try {
			const assemblies = await getAllAssembly();
			res.status(200).json(assemblies);
		} catch (error) {
			console.error('Error fetching assemblies:', error);
			res.status(500).json({error: 'Internal Server Error'});
		}
	});
	
	app.get("/topics", async (req: Request, res: Response) => {
		//Do the validation
		
		//Do the error returning if necessary
		
		//Do services rules
		
		//Do the database queries
		try {
			const topics = await getAllTopic();
			res.status(200).json(topics);
		} catch (error) {
			console.error('Error fetching topics:', error);
			res.status(500).json({error: 'Internal Server Error'});
		}
	});
	
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
	
	app.get("/activities", async (req: Request, res: Response) => {
		//Do the validation
		
		//Do the error returning if necessary
		
		//Do services rules
		
		//Do the database queries
		try {
			const activities = await getAllDocument();
			res.status(200).json(activities);
		} catch (error) {
			console.error('Error fetching activities:', error);
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
	
	app.get("/locations", async (req: Request, res: Response) => {
		//Do the validation
		
		//Do the error returning if necessary
		
		//Do services rules
		
		//Do the database queries
		
	});
	
	app.post('/locations', async (req: Request, res: Response) => {
		
		//TODO : Make a service rule that check that the combination of ADDRESS + POSTAL CODE + COUNTRY does not already exist in DB
		
		//Do the validation
		
		//Do the error returning if necessary
		
		//Do services rules
		
		//Do the database queries
		
		
	});
	
	/*app.delete('/locations/:id', async (req: Request, res: Response) => {
		
		// TODO : Need more testing when activity and equipment have a post route
		
		
		const locationId = req.params.id;
		
		try {
			await deleteLocation(locationId);
			res.status(200).json({ message: 'Location deleted successfully' });
		} catch (error) {
			console.error('Error deleting location:', error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	});*/
	
	
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
	
	
	// app.get("/movies", async (req: Request, res: Response) => {
	//
	//         const validation = listMovieValidation.validate(req.query)
	//
	//         if (validation.error) {
	//             res.status(400).send(generateValidationErrorMessage(validation.error.details))
	//             return
	//         }
	//
	//         const listMoviesRequest = validation.value
	//         let limit = 6
	//         if (listMoviesRequest.limit) {
	//             limit = listMoviesRequest.limit
	//         }
	//         const page = listMoviesRequest.page ?? 1
	//         try {
	//
	//             console.log(await prisma.movie.count())
	//
	//
	//             res.status(200).send( await prisma.movie.findMany({
	//                 skip: (page - 1) * limit,
	//                 take: limit,
	//             }))
	//         } catch
	//             (error) {
	//             console.log(error)
	//             res.status(500).send({error: "Internal error"})
	//         }
	//     }
	// )
	
	// app.post("/movies", async (req: Request, res: Response) => {
	//     const {error, value} = movieValidation.validate(req.body)
	//
	//     if (error) {
	//         res.status(400).send(generateValidationErrorMessage(error.details))
	//         return
	//     }
	//
	//     const MovieRequest = value as MovieRequest
	//
	//     try {
	//
	//         // Crée un nouveau film
	//         const movieCreated = await prisma.movie.create({
	//             data: MovieRequest
	//         });
	//
	//         res.status(201).json(movieCreated);
	//     } catch (error) {
	//         res.status(500).json({error: 'Une erreur est survenue lors de la création de l\'utilisateur.'});
	//     }
	// });
	
	// app.get("/movies/:id", async (req: Request, res: Response) => {
	//     try {
	//         const validation = movieIdValidation.validate(req.params)
	//
	//         if (validation.error) {
	//             res.status(400).send(generateValidationErrorMessage(validation.error.details))
	//             return
	//         }
	//
	//         const movieId = validation.value
	//         // recuperation des film
	//
	//         const movie = await prisma.movie.findUnique({
	//             where: {
	//                 id: movieId.id,
	//             },
	//         })
	//
	//         if (movie === null) {
	//             res.status(404).send({"error": `movie ${movieId.id} not found`})
	//             return
	//         }
	//         res.status(200).send(movie)
	//     } catch (error) {
	//         res.status(500).json({error: 'Une erreur est survenue lors de la création de l\'utilisateur.'});
	//     }
	//
	//
	// })
	
	// app.patch("/movies/:id", async (req: Request, res: Response) => {
	//
	//
	//     const validation = updateMovieValidation.validate({...req.params, ...req.body})
	//
	//     if (validation.error) {
	//         res.status(400).send(generateValidationErrorMessage(validation.error.details))
	//         return
	//     }
	//
	//     const updateMovieRequest = validation.value
	//
	//     try {
	//         const movie = await prisma.movie.update({
	//             where: {
	//                 id: updateMovieRequest.id,
	//             },
	//             data: {
	//                 title: updateMovieRequest.title,
	//                 description: updateMovieRequest.description,
	//                 duration: updateMovieRequest.duration
	//             },
	//         })
	//         if (movie === null) {
	//             res.status(404).send({"error": `Movie ${updateMovieRequest.id} not found`})
	//             return
	//         }
	//         res.status(200).send(movie)
	//     } catch (error) {
	//         console.log(error)
	//         res.status(500).send({error: "Internal error"})
	//     }
	// })
	
	// app.delete("/movies/:id", async (req: Request, res: Response) => {
	//     try {
	//         const validationResult = movieIdValidation.validate(req.params)
	//
	//         if (validationResult.error) {
	//             res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
	//             return
	//         }
	//         const movieId = validationResult.value
	//
	//         const product = await prisma.movie.findUnique({
	//             where: {
	//                 id: movieId.id,
	//             },
	//         })
	//         if (product === null) {
	//             res.status(404).send({"error": `movie ${movieId.id} not found`})
	//             return
	//         }
	//
	//         const movieDeleted = await prisma.movie.delete({
	//             where: {
	//                 id: movieId.id,
	//             },
	//         })
	//         res.status(200).send(movieDeleted)
	//     } catch (error) {
	//         console.log(error)
	//         res.status(500).send({error: "Internal error"})
	//     }
	// })
};