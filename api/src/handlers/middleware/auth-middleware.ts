import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import ms from 'ms';
import { NextFunction, Response, Request } from "express";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            id: string;
        };
    }
}

export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: Token is missing' });
        }

        const session = await validateToken(token);

        if (!session) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        req.user = { id: session.personId }; // Ajouter l'ID de l'utilisateur à la requête
        next();
    } catch (error) {
        console.error('Erreur lors de l\'authentification :', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function generateToken(personId: string): Promise<string> {
    const token = uuidv4();
    await prisma.session.create({
        data: {
            token,
            expirationDate: new Date(Date.now() + ms('1d')),
            personId,
        },
    });
    return token;
}

export async function validateToken(token: string): Promise<{ personId: string } | null> {
    const existingToken = await prisma.session.findUnique({
        where: { token: token },  // Utiliser 'token' comme clé
    });
    if (!existingToken) return null;
    if (existingToken.expirationDate < new Date()) {
        // Supprimer le token expiré
        await prisma.session.delete({ where: { token: token } });
        return null;
    }
    return { personId: existingToken.personId };
}

export async function deleteToken(token: string): Promise<void> {
    await prisma.session.delete({ where: { token: token } });
}