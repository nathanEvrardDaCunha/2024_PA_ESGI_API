# Use the official Node.js 18 image as the base
FROM node:18

# Set the working directory to /app/api
WORKDIR /app/api

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including ts-node)
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your application will listen on
EXPOSE 3000

# Set the default command to run the application
CMD ["npm", "run", "start:dev"]