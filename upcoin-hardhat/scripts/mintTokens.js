const {Web3} = require("web3");
const fs = require("fs");
const path = require("path");

async function main() {
    // Inicializar Web3 con un proveedor (Hardhat local node)
    const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

    // Obtener las cuentas disponibles en la red
    const accounts = await web3.eth.getAccounts();
    
    // Usamos la primera cuenta para interactuar con el contrato (deployer)
    // Deployer inicia la transación y paga la tarifa de gas, 
    // es la cuenta dónde se despliega el contrato por primera vez y si ingresan los primero tokens
    const deployer = accounts[0]; 
    console.log("Usando la cuenta (Deployer):", deployer);

    // Dirección del contrato desplegado UPCoin y Relayer
    const upcoinAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Direcciones de despligue
    const relayerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    // Cargar ABI del contrato UPCoin
    const abiPath = path.join(__dirname, "../artifacts/contracts/UPCoin.sol/UPCoin.json");
    const upcoinABI = JSON.parse(fs.readFileSync(abiPath, "utf-8")).abi;

    // Crear una instancia del contrato UPCoin
    const upcoinInstance = new web3.eth.Contract(upcoinABI, upcoinAddress);

    // Cargar ABI del contrato Relayer
    const relayerAbiPath = path.join(__dirname, "../artifacts/contracts/Relayer.sol/Relayer.json");
    const relayerABI = JSON.parse(fs.readFileSync(relayerAbiPath, "utf-8")).abi;

    // Crear una instancia del contrato Relayer
    const relayerInstance = new web3.eth.Contract(relayerABI, relayerAddress);

    // Configurar la cantidad de tokens a acuñar
    const amount = 100 * 10 ** 2; // 100 tokens (considerando los 2 decimales)
    const recipient = accounts[2]; // Cuanta destino para los nuevos tokens UPC creados
    console.log(`Minting ${amount / 10 ** 2} tokens a ${recipient}`);

    // Llamar a la función `mint` solo accesible por el relayer
    // Llamar a la función `relayMint` en el contrato Relayer
    try {
        const tx = await relayerInstance.methods
            .relayMint(recipient, amount)
            .send({ from: deployer });

        console.log(`Transacción exitosa: ${tx.transactionHash}`);
    } catch (error) {
        console.error("Error minting tokens:", error.message);
    }
}

// Ejecutar la función principal
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error en el script:", error.message);
        process.exit(1);
    });