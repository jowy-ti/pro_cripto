# Usa la imagen base de Node.js 20 en Alpine
FROM node:20-alpine

# Instala dependencias necesarias para Hardhat
RUN apk add --no-cache python3 make g++ bash

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos package.json y package-lock.json y luego instala las dependencias
COPY package*.json ./
RUN npm install

# Copia el resto de los archivos de la aplicación al contenedor
COPY . .

# Expone el puerto que necesitas (opcional)
EXPOSE 8082

# Comando por defecto para iniciar Hardhat
CMD ["npx", "hardhat", "node"]