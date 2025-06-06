FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm install -g @angular/cli

RUN  ng add @angular/material --skip-confirmation

EXPOSE 4200
