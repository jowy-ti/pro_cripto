# Usa la imagen base de Node 20 en Alpine Linux (ligera y adecuada para producción)
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

COPY package*.json .

# Instalar dependencias
RUN npm install

COPY *.js .

# Exponer el puerto 8081
EXPOSE 8081

# Comando para iniciar la aplicación
CMD ["node", "server.js"]