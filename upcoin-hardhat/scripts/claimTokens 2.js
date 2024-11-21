const {Web3} = require("web3");
const fs = require("fs");
const path = require("path");

async function main() {
    // Inicializar Web3 con un proveedor (Hardhat local node)
    const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

    const upcoinAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Dirección del contrato desplegado

    // Cargar ABI del contrato UPCoin
    const abiPath = path.join(__dirname, "../artifacts/contracts/UPCoin.sol/UPCoin.json");
    const upcoinABI = JSON.parse(fs.readFileSync(abiPath, "utf-8")).abi;

    // Clave privada y dirección del usuario que reclama tokens
    const userPrivateKey = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"; // Reemplaza con la clave privada del usuario
    const userAddress = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"; // Reemplaza con la dirección del usuario

    // Crear una instancia del contrato UPCoin
    const upcoinInstance = new web3.eth.Contract(upcoinABI, upcoinAddress);

    try {
        console.log("Preparando la transacción para reclamar tokens...");

        // Construir la transacción para llamar a claimTokens
        const claimTx = upcoinInstance.methods.claimTokens();
        const gasEstimate = await claimTx.estimateGas({ from: userAddress });
        const gasPrice = await web3.eth.getGasPrice();

        const txData = {
            from: userAddress,
            to: upcoinAddress, // Dirección del contrato
            data: claimTx.encodeABI(),
            gas: gasEstimate,
            gasPrice,
        };

        // Firmar la transacción con la clave privada
        console.log("Firmando la transacción...");
        const signedTx = await web3.eth.accounts.signTransaction(txData, userPrivateKey);

        // Enviar la transacción firmada
        console.log("Enviando la transacción...");
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        // ESTO FUNCIONA BIEN PARA MOSTRA LA TRANSACIÓN

        console.log("Tokens reclamados exitosamente.");
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