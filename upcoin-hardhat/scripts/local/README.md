# Scripts para la red local de UPCoin

Esta carpeta contiene una serie de scripts diseñados para interactuar con el contrato inteligente UPCoin en un entorno local utilizando Hardhat. A continuación, se detallan los scripts disponibles, su propósito y cómo ejecutarlos.

## Prerrequisitos

1.	Configurar el entorno local con Hardhat:

* Iniciar un nodo local: 
```
npx hardhat node.
```
* Asegurarte de tener las dependencias necesarias instaladas:
```
npm install.
```

2. Conexión con la red local

* Los scripts están configurados para utilizar `http://127.0.0.1:8545`.


## Scripts Disponibles
### 1. localDeploy.js

Despliega el contrato inteligente UPCoin en la red local.

```
npx hardhat run scripts/local/localDeploy.js --network localhost
```
* Despliega el contrato UPCoin con un suministro inicial de 1,000,000 tokens.
* Muestra la dirección del contrato desplegado y la cuenta que realizó el despliegue.


### 2. claimTokens.js

Permite a un usuario reclamar tokens UPC.

```
node scripts/local/claimTokens.js
```
* Interactúa con la función claimTokens del contrato UPCoin.
* Utiliza la cuenta del relayer para firmar y enviar la transacción en nombre del usuario.

### 3. transferWithSignature.js

Prueba la función de transferencia con firma (transferWithSignature) para el uso de meta-transacciones.

```
node scripts/local/transferWithSignature.js
```
* Genera un hash de mensaje, lo firma y envía una transacción utilizando la función transferWithSignature.
* Transfiere 50 UPC desde una cuenta a otra utilizando la cuenta del relayer.


### 4. mintTokens.js

Mina nuevos tokens UPC y los asigna a una cuenta específica.

```
node scripts/local/mintTokens.js
```
* Llama a la función mint del contrato para acuñar 100 tokens UPC.
* Utiliza la cuenta del relayer para autorizar la transacción.


### 5. mintTokensNoRelayer.js

Demuestra el comportamiento cuando una cuenta no autorizada intenta acuñar tokens.

```
node scripts/local/mintTokensNoRelayer.js
```
* Intenta ejecutar la función mint con una cuenta no autorizada.
* Genera un error: "Only Relayer can execute this function".


### 6. balance.js

Este script consulta y muestra el saldo de tokens UPC y ETH para una lista de direcciones de wallet en una red local de Hardhat.

```
node scripts/local/balance.js
```
* Muestra los saldos de UPC y ETH de las 4 primeras wallet en la consola.

## Notas

* **Rutas de configuración**: Los scripts utilizan la dirección local del contrato y las claves privadas proporcionadas por Hardhat para interactuar con la blockchain.

* **ABI del contrato**: Se obtiene dinámicamente de los artefactos generados por Hardhat (artifacts/contracts/UPCoin.sol/UPCoin.json).

* **Proveedores**: Todos los scripts están configurados para interactuar con `http://127.0.0.1:8545`.

