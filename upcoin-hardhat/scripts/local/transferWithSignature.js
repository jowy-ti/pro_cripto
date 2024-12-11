//upcoin-hardhat/scripts/local/transferWithSignature.js
const {Web3} = require("web3");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

/**
 * Ejecutar script
 * node testTransferWithSignature.js
 */


const web3 = new Web3("http://127.0.0.1:8545"); // Configuración de la red local: Hardhat local node

// Dirección del contrato UPCoin en local
const upcoinAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Dirección de la wallet del Relayer y su clave privada
const relayerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const relayerPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

async function testTransferWithSignature() {
    try {
        // Cargar ABI del contrato UPCoin
        const upcoinPath = path.resolve(__dirname, "../../artifacts/contracts/UPCoin.sol/UPCoin.json");
        const upcoinJSON = JSON.parse(fs.readFileSync(upcoinPath, "utf8"));
        const upcoinAbi = upcoinJSON.abi;

        // Crear instancia del contrato
        const upcoinContract = new web3.eth.Contract(upcoinAbi, upcoinAddress);

        // Direcciones de prueba
        const accounts = await web3.eth.getAccounts();
        const from = accounts[1]; // Dirección del remitente (usuario)
        const to = accounts[2]; // Dirección del destinatario (otro usuario)
        const amount = 50 * (10 ** 2); // 50 UPC (ajustado a 2 decimales)

        // Generar el hash del mensaje
        const messageHash = web3.utils.soliditySha3(
            { type: "address", value: from },
            { type: "address", value: to },
            { type: "uint256", value: amount }
        );

        console.log("Hash del mensaje generado:", messageHash);

        // Firmar el hash con la cuenta del remitente (usuario)
        const signature = await web3.eth.sign(messageHash, from);
        console.log("Firma generada:", signature);

        const transferTx = upcoinContract.methods.transferWithSignature(from, to, amount, signature)
        const gasEstimate = await transferTx.estimateGas({ from: relayerAddress });
        
        const gasPrice = await web3.eth.getGasPrice();

        // Obtener el nonce de la cuenta del relayer
        const nonce = await web3.eth.getTransactionCount(relayerAddress, 'latest');

        // Preparar los datos de la transacción para transferWithSignature
        const txData = {
            from: relayerAddress, // Dirección del relayer
            to: upcoinAddress, // Dirección del contrato
            data: transferTx.encodeABI(),
            gas: gasEstimate, // Límite de gas
            gasPrice: gasPrice, // Precio del gas
            nonce: nonce, // Nonce explícito
        };

       // Firmar la transacción con la clave privada del relayer
       console.log("Firmando la transacción...");
       const signedTx = await web3.eth.accounts.signTransaction(txData, relayerPrivateKey);

       // Enviar la transacción firmada
       console.log("Enviando la transacción...");
       const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log("Transferencia completada. Detalles de la transacción:");
        console.log(receipt);

    } catch (error) {
        console.error("Error al probar la función transferWithSignature:", error);
    }
}

testTransferWithSignature();