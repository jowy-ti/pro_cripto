# Usar la imagen oficial de MongoDB como base
FROM mongo:4.0

# Instalar nfs-utils para habilitar el soporte NFS
RUN apk add --no-cache nfs-utils

# Exponer el puerto predeterminado de MongoDB
EXPOSE 27017

# Comando por defecto para iniciar MongoDB
CMD ["mongod"]