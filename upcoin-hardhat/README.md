# Proyecto Hardhat UPCoin

Este directorio contiene todo el proyecto de Hardhat para la creación del token UPCoin. Los archivos y directorios a destacar son los siguientes:

* **contratcs**: Contiene el contrato UPCoin.sol.

* **scripts**: Incluye los scripts utilizados para el despliegue del contrato inteligente en local y en la testnet de Sepolia. Además, dispone de los scripts empleados para verificar el funcionamiento del contrato en la red local antes de migrarlo a la testnet.

* **.env**: En el archivo .env` se almacenan las variables de entorno necesarias para la configuración del proyecto, como RELAYER_PRIVATE_KEY y INFURA_API_URL, que son utilizadas durante el despliegue en la testnet. Este archivo permite mantener de forma segura y separada la configuración sensible del código fuente del proyecto.
