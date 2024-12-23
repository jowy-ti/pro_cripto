# Despliegue del contrato UPCoin en Sepolia Testnet

## Descripción del Script

El script despliega el contrato inteligente UPCoin en la testnet de Sepolia usando las siguientes herramientas y tecnologías:

* **Web3.js**: Para interactuar con la blockchain de Ethereum.

* **Hardhat**: Para gestionar el contrato inteligente y compilarlo.

* **Infura**: Para conectarse a la testnet de Sepolia sin necesidad de correr un nodo local.

## Ejecución

```
npx hardhat run scripts/testnet/testnetDeploy.js --network sepolia
```

Este comando desplegará el contrato inteligente de UPCoin y mostrará la dirección del contrato desplegado en la testnet de Sepolia.

## Funcionamiento

1.	El script utiliza la clave privada de la cuenta definida en .env para acceder a la wallet que se utilizará para desplegar el contrato.

2.	El contrato UPCoin se despliega con una cantidad inicial de tokens definida en el script (1,000,000 UPCoin con 2 decimales).

3.	El contrato se despliega en la red Sepolia utilizando la infraestructura de Infura para interactuar con la blockchain.

4.	Una vez desplegado, el script imprime en la consola la dirección del contrato UPCoin.

## Ejemplo de salida

En el último despliegue del contrato, la salida obtenida fue la siguiente:

```
Deploying contract with the account: 0x0e627480Fd689313967b81a85b40fAa131653F51
UPCoin deployed to: 0xab4c4E5699202E2D7BB2d21E993eD2AC421b6570
```