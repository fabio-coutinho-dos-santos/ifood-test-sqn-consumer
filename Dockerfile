FROM node:18-alpine

WORKDIR /app

COPY . /app

RUN npm i

EXPOSE 3001

ENTRYPOINT [ "npm", "run" ]