FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g @angular/cli

EXPOSE 4200

CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--disable-host-check"]
