FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# this is a random URI
# ENV MONGO_URI=mongodb://mongodb:27017/mydatabase 
ENV MONGO_URI=mongodb://mongodb:27017/mydatabase
EXPOSE 5001

# Command to run the app
CMD ["node", "server.js"]
