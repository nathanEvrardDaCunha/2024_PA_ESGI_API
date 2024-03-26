# Utiliser l'image Node.js officielle en version 18 comme base
FROM node:18

# Créer le répertoire de travail pour l'application
WORKDIR /app

# Copier le fichier package.json et package-lock.json (si présent)
COPY package*.json ./

# Installer les dépendances (y compris ts-node)
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port sur lequel votre application écoutera
EXPOSE 3000

# Définir la commande par défaut pour exécuter votre application
CMD ["npm", "run", "start:dev"]