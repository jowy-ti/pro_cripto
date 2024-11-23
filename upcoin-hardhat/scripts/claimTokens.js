const { Web3 } = require("web3");
const fs = require("fs");
const path = require("path");

async function main() {
    // Inicializar Web3 con un proveedor
    const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

    const relayerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Dirección del contrato Relayer
    const relayerPrivateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"; // Clave privada del relayer cuenta #1
    const userAddress = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"; // Usuario que reclama tokens cuenta #2

    // Cargar ABI del contrato Relayer
    const relayerABIPath = path.join(__dirname, "../artifacts/contracts/Relayer.sol/Relayer.json");
    const relayerABI = JSON.parse(fs.readFileSync(relayerABIPath, "utf-8")).abi;

    // Crear una instancia del contrato Relayer
    const relayerInstance = new web3.eth.Contract(relayerABI, relayerAddress);

    try {
        console.log("Preparando la transacción para reclamar tokens...");

        // Construir la transacción para llamar a claimTokensForUser
        const claimTx = relayerInstance.methods.relayClaimTokens(userAddress);
        const gasEstimate = await claimTx.estimateGas({ from: relayerAddress });
        const gasPrice = await web3.eth.getGasPrice();

        // Obtener el nonce de la cuenta del relayer
        const nonce = await web3.eth.getTransactionCount(relayerAddress, 'latest');

        const txData = {
            from: relayerAddress,
            to: relayerAddress, // Dirección del contrato Relayer
            data: claimTx.encodeABI(),
            gas: gasEstimate,
            gasPrice,
            nonce: 0, // Añadir el nonce correcto
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