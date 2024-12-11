//upcoin-hardhat/scripts/local/mintTokensNoRelayer.js
const {Web3} = require("web3");
const fs = require("fs");
const path = require("path");

/**
 * El minado de tokens está restringido únicamente al Relayer, quien es el único autorizado para enviar esta transacción.
 * Este script demuestra el comportamiento del contrato UPCoin cuando un usuario no autorizado intenta ejecutar 
 * la función de minado de tokens.
 * 
 * Al ejecutar este script, se generará el siguiente error:
 * "Error al reclamar tokens: Error happened while trying to execute a function inside a smart contract".
 * 
 * Además, en la terminal de `npx hardhat node` se podrá observar la razón específica del rechazo de la transacción:
 * "Error: reverted with reason string 'Only Relayer can execute this function'".
 */

async function main() {
    // Inicializar Web3 con un proveedor (Hardhat local node)
    const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

    // Dirección de despligue del contrato desplegado UPCoin
    const upcoinAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // Dirección de la wallet de un usuario y su clave privada
    const userAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
    const userPrivateKey = "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6";

     // Cargar ABI del contrato UPCoin
     const upcoinPath = path.resolve(__dirname, "../../artifacts/contracts/UPCoin.sol/UPCoin.json");
     const upcoinJSON = JSON.parse(fs.readFileSync(upcoinPath, "utf8"));
     const upcoinAbi = upcoinJSON.abi;
 
     // Crear instancia del contrato
     const upcoinContract = new web3.eth.Contract(upcoinAbi, upcoinAddress);

    // Configurar la cantidad de tokens a acuñar
    const amount = 100 * 10 ** 2; // 100 tokens (considerando los 2 decimales)
   
    // El destinatario de los nuevos tokens será el mismo
    const recipient = userAddress; 
    
    console.log(`Minando ${amount / 10 ** 2} tokens UPC para ${recipient}`);

    try {
        console.log("Preparando la transacción para minar tokens...");

        // Construir la transacción para llamar a claimTokens
        const mintTx = upcoinContract.methods.mint(recipient, amount);
        const gasEstimate = await mintTx.estimateGas({ from: userAddress });
        const gasPrice = await web3.eth.getGasPrice();

        // Obtener el nonce de la cuenta del relayer
        const nonce = await web3.eth.getTransactionCount(userAddress, 'latest');

        const txData = {
            from: userAddress,  // El usuario enviara la transación al contrato
            to: upcoinAddress, // Dirección del contrato UPcoin
            data: mintTx.encodeABI(),
            gas: gasEstimate,
            gasPrice,
            nonce: nonce,
        };

        // Firmar la transacción con la clave privada del usuario
        console.log("Firmando la transacción...");
        const signedTx = await web3.eth.accounts.signTransaction(txData, userPrivateKey);

        // Enviar la transacción firmada
        console.log("Enviando la transacción...");
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log("Tokens minados exitosamente.");
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