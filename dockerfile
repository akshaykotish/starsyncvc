# Use an official Node.js runtime as a parent image.
FROM node:18-slim

# Create and set the working directory.
WORKDIR /app

# Copy package files and install dependencies.
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code.
COPY . .

# Cloud Run expects the app to listen on the port defined in the PORT environment variable.
ENV PORT=8080

# Expose the port.
EXPOSE 8080

# Start the server.
CMD ["npm", "start"]
