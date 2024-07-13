# Étape de build
FROM node:21-alpine AS build

# Installer les dépendances système nécessaires
RUN apk add --no-cache python3 make g++ git

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires pour l'installation des dépendances
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma/ ./prisma/

# Installer les dépendances
RUN npm install

# Générer le client Prisma
RUN npx prisma generate

# Copier le reste des fichiers du projet
COPY . .

# Compiler le projet TypeScript
RUN npm run build

# Étape de production
FROM node:21-alpine AS prod

# Définir le répertoire de travail
WORKDIR /app

# Copier les node_modules et les fichiers compilés
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma/ ./prisma/
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules

# Copier le fichier .env pour les variables d'environnement
COPY --from=build /app/.env ./

# Exposer le port sur lequel l'API va tourner (si nécessaire)
EXPOSE 3000

# Lancer le serveur Node.js
CMD ["npm", "start"]
