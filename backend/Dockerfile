# Use Node.js 16 as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json first for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all the application files into the container
COPY . .

# Expose port 5001 for the backend service
EXPOSE 5001

# Command to run the app
CMD ["node", "server.js"]
