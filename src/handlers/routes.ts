import express, { Request, Response } from "express";
import {getAllPerson} from "../repository/personRepository";

export const initRoutes = (app: express.Express) => {

    app.get("/persons", async (req: Request, res: Response) => {

        //Do the validation

        //Do the error returning if necessary

        //Do services rules

        //Do the database queries

        try {
            const persons = await getAllPerson();
            res.status(200).json(persons);
        } catch (error) {
            console.error('Error fetching persons:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })

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
}