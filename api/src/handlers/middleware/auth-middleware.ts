import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import ms from 'ms';
import { NextFunction, Response, Request } from "express";
const prisma = new PrismaClient();
export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: Token is missing' });
        }

        const isValid = await validateToken(token);

        if (!isValid) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

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

export async function validateToken(token: string): Promise<boolean> {
    const existingToken = await prisma.session.findUnique({
        where: {  id: token  },
    });
    if (!existingToken) return false;
    if (existingToken.expirationDate < new Date()) {
        // Supprimer le token expiré
        await prisma.session.delete({ where: { id:token } });
        return false;
    }
    return true;
}

export async function deleteToken(token: string): Promise<void> {
    await prisma.session.delete({ where: { id:token } });
}
