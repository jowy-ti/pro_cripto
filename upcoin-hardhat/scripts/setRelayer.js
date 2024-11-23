// TODO ARREGLAR PARA QUE LO HAGA deployContracts.js

const {Web3} = require('web3');
require('dotenv').config(); // Para manejar las variables de entorno (.env)
const fs = require("fs");
const path = require("path");

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_API_URL)); // Conexión con Sepolia

const upcoinAddress = '0xD3BcD23F1B6d0aDA3e83C84443e2285B75F2D008'; // Dirección del contrato desplegado en Sepolia
const relayerAddress = '0x86F53C5aF034dC83083F7c935b132601D66AA8eb'; // Dirección del contrato Relayer

// Crear una instancia del contrato UPCoin
const abiPath = path.join(__dirname, "../artifacts/contracts/UPCoin.sol/UPCoin.json");
const upcoinABI = JSON.parse(fs.readFileSync(abiPath, "utf-8")).abi;
const upcoinContract = new web3.eth.Contract(upcoinABI, process.env.UPCOIN_DEPLOY_ADDRESS);

// Definir la dirección del administrador (la que desplegó el contrato)
const deployerAddress = '0x0e627480Fd689313967b81a85b40fAa131653F51'; // La dirección que desplegó el contrato UPCoin

// Firma de la transacción con la clave privada
const privateKey = '6ebbaac02cddb91a54e03081f23ad97a0927558e809fbc2b69fd6ec68fea143d'; // Clave privada del deployer

async function setRelayer() {
  try {
    // Obtener el nonce
    const nonce = await web3.eth.getTransactionCount(deployerAddress);

    // Estimar gas necesario para la transacción
    const gasEstimate = await upcoinContract.methods.setRelayer(relayerAddress).estimateGas({ from: deployerAddress });

    // Construir los datos de la transacción
    const txData = {
      to: upcoinAddress,
      data: upcoinContract.methods.setRelayer(relayerAddress).encodeABI(),
      gas: gasEstimate.toString(),
      gasPrice: await web3.eth.getGasPrice(),
      nonce: nonce,
      from: deployerAddress,
    };

    // Firmar la transacción
    const signedTx = await web3.eth.accounts.signTransaction(txData, privateKey);

    // Enviar la transacción firmada
    const tx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log("Transacción enviada:", tx);
  } catch (error) {
    console.error("Error al ejecutar setRelayer:", error);
  }
}

// Llamar a la función para establecer el relayer
setRelayer();