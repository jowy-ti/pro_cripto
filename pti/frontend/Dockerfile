# Usa la imagen base de Node 20 en Alpine Linux (ligera y adecuada para producción)
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

COPY package*.json .

COPY lib/ ./lib

# Instalar dependencias
RUN npm install

COPY . .

# Exponer el puerto 8080
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["npm", "start"]