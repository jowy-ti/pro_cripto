//upcoin-hardhat/scripts/local/claimTokens.js
const { Web3 } = require("web3");
const fs = require("fs");
const path = require("path");

async function main() {
  
    const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545")); // Configuración de la red local: Hardhat local node

    // Dirección del contrato UPCoin en local
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const relayerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Dirección de la wallet del Relayer cuenta #0
    const relayerPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Clave privada de la wallet del Relayer
    
    const userAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Usuario que reclama tokens cuenta #1

    // Cargar ABI del contrato UPCoin
    const upcoinPath = path.resolve(__dirname, "../../artifacts/contracts/UPCoin.sol/UPCoin.json");
    const upcoinJSON = JSON.parse(fs.readFileSync(upcoinPath, "utf8"));
    const upcoinAbi = upcoinJSON.abi;

    // Crear instancia del contrato
    const upcoinContract = new web3.eth.Contract(upcoinAbi, contractAddress);

    try {
        console.log("Preparando la transacción para reclamar tokens...");

        // Construir la transacción para llamar a claimTokens
        const claimTx = upcoinContract.methods.claimTokens(userAddress);
        const gasEstimate = await claimTx.estimateGas({ from: relayerAddress });
        const gasPrice = await web3.eth.getGasPrice();

        // Obtener el nonce de la cuenta del relayer
        const nonce = await web3.eth.getTransactionCount(relayerAddress, 'latest');

        const txData = {
            from: relayerAddress, 
            to: contractAddress, // Dirección del contrato UPcoin
            data: claimTx.encodeABI(),
            gas: gasEstimate,
            gasPrice,
            nonce: nonce,
        };

        // Firmar la transacción con la clave privada del relayer
        console.log("Firmando la transacción...");
        const signedTx = await web3.eth.accounts.signTransaction(txData, relayerPrivateKey);

        // Enviar la transacción firmada
        console.log("Enviando la transacción...");
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log("Tokens reclamados exitosamente por el usuario.");
        console.log("Transaction Receipt:", receipt);
    } catch (error) {
        console.error("Error al reclamar tokens:", error.message);
    }
}

// Ejecutar la función principal
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error en el script:", error.message);
        process.exit(1);
    });