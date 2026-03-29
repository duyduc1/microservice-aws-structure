# Dockerfile
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Database configuration
ENV DB_HOST=microservice-test.cyf6wcuq0j47.us-east-1.rds.amazonaws.com
ENV DB_USER=root
ENV DB_PASSWORD=M1aT4Tt7aeXc
ENV DB_NAME=mydb
ENV DB_PORT=3306

EXPOSE 3000

CMD ["node", "index.js"]