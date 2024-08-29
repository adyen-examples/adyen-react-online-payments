FROM node:20-alpine

COPY . .

RUN npm install

EXPOSE 8080
CMD [ "npm", "run", "server"]