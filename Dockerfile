FROM node:16

COPY . .

RUN npm install

EXPOSE 8080
CMD [ "npm", "run", "server"]