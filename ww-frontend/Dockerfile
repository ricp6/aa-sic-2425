# Etapa 1: Build da aplicação Angular
FROM node:20-alpine AS build

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build -- --configuration production

# Etapa 2: Servir a app Angular com Nginx
FROM nginx:alpine

COPY --from=build /app/dist/ww-frontend /usr/share/nginx/html

# Remove config padrão e adiciona uma customizada (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
