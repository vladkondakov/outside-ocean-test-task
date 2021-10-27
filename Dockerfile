FROM node:14-alpine

WORKDIR /app
COPY . .

RUN npm i
RUN npm run build
RUN npm run migation:up

EXPOSE 3000

CMD npm run start:dev
