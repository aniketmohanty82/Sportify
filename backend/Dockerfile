FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# this is a random URI
# ENV MONGO_URI=mongodb://mongodb:27017/mydatabase 
ENV MONGO_URI=mongodb+srv://saiedupulapati4:jmzLsxDWeHqA6noc@cluster0.whqrr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
EXPOSE 5001

# Command to run the app
CMD ["node", "server.js"]
