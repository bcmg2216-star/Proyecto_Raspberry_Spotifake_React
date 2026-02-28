# Etapa 1: Construir la aplicación usando la potencia de TU PC (Súper rápido)
FROM --platform=$BUILDPLATFORM node:20-alpine as build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servir la aplicación en Nginx para la RASPBERRY
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]