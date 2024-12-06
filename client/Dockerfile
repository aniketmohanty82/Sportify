FROM node:16 as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Use Nginx to serve the build
FROM nginx:alpine

# Copy the nginx.conf file explicitly into the build context first
COPY ./nginx.conf /usr/src/app/nginx.conf

# Debugging: Check if nginx.conf is available
RUN ls -l /usr/src/app/nginx.conf

# Copy the build files and nginx configuration
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
