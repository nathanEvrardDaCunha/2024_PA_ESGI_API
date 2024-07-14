import {PrismaClient} from "@prisma/client";
import {initRoutes} from "./handlers/routes";
import express from "express";
import cors from "cors"; // Import the cors middleware

export const prisma = new PrismaClient();

async function main() {
    const app = express();
    const port = 3000;

    // Enable CORS for all routes
    app.use(cors({
        origin: ["http://localhost:3001", "http://localhost:3002"],
        optionsSuccessStatus: 200,
    }));

    app.use(express.json());
    initRoutes(app);

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });