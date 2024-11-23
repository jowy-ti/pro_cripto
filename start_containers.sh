#!/bin/bash

# Directorio del backend
cd codigo-backend || { echo "Error: No se pudo acceder al directorio codigo-backend"; exit 1; }

# Construcción y ejecución del contenedor backend
echo "Construyendo y ejecutando el contenedor backend..."
docker build -t backend . || { echo "Error al construir el contenedor backend"; exit 1; }
docker run -d --name "back" --env-file .env --network cluster -p 8081:5000 backend || { echo "Error al ejecutar el contenedor backend"; exit 1; }

# Descargar la imagen de MongoDB y ejecutar el contenedor
echo "Descargando la imagen de MongoDB..."
docker pull mongo:4.0 || { echo "Error al descargar la imagen de MongoDB"; exit 1; }
echo "Ejecutando el contenedor MongoDB..."
docker run -d --name mongodb --network cluster -p 8082:27017 -v mongodb_data:/data/db mongo:4.0 || { echo "Error al ejecutar el contenedor MongoDB"; exit 1; }

# Directorio del frontend
cd ../frontend || { echo "Error: No se pudo acceder al directorio frontend"; exit 1; }

# Construcción y ejecución del contenedor frontend
echo "Construyendo y ejecutando el contenedor frontend..."
docker build -t frontend . || { echo "Error al construir el contenedor frontend"; exit 1; }
docker run -d --name "react" --env-file .env -p 8080:3000 frontend || { echo "Error al ejecutar el contenedor frontend"; exit 1; }

echo "Todos los contenedores se han creado y están en ejecución."