const {Web3} = require("web3");
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers'); // Usamos ethers.js para generar la firma

async function main() {
    // Configurar Web3 con el proveedor
    const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

    // Direcciones del contrato Relayer y ABI
    const relayerAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Dirección del contrato Relayer
    const abiPath = path.join(__dirname, "../artifacts/contracts/Relayer.sol/Relayer.json");
    const relayerABI = JSON.parse(fs.readFileSync(abiPath, "utf-8")).abi;

    // Crear una instancia del contrato Relayer
    const relayerInstance = new web3.eth.Contract(relayerABI, relayerAddress);

    // Dirección y cantidad de la transacción
    const fromAddress = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"; // Dirección del remitente
    const toAddress = "0x90F79bf6EB2c4f870365E785982E1f101E93b906"; // Dirección del destinatario
    const amount = 25; // Monto a transferir (en UPC, sin los decimales)

    // Clave privada del firmante (remitente)
    const privateKey = '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a';

    // Construir el mensaje para firmar
    const messageHash = web3.utils.soliditySha3(
        { type: 'address', value: fromAddress },
        { type: 'address', value: toAddress },
        { type: 'uint256', value: amount }
    );

    console.log("Hash Obtenido: " + messageHash);

    // Verificar que el messageHash es válido
    if (!web3.utils.isHex(messageHash)) {
        console.error("El messageHash no es un valor hexadecimal válido.");
        return;
    } else console.log("messageHash valido")

    // Generar la firma utilizando ethers.js
    const signer = new ethers.Wallet(privateKey);
    console.log("Signer address: " + signer.address); // Mostrar la dirección del firmante

    // Usar directamente el messageHash ya que es un valor hexadecimal
    const signature = await signer.signMessage(messageHash);

    console.log("Firma conseguida: ", signature);

    // Preparar la transacción para llamar a relayTransfer en el contrato Relayer
    const txData = {
        from: fromAddress,
        to: relayerAddress,
        data: relayerInstance.methods.relayTransfer(fromAddress, toAddress, amount, signature).encodeABI(),
    };

    // Estimar gas
    const gasEstimate = await web3.eth.estimateGas(txData);

    // Enviar la transacción
    const signedTx = await web3.eth.accounts.signTransaction(
        {
            ...txData,
            gas: gasEstimate,
            gasPrice: await web3.eth.getGasPrice(),
        },
        privateKey
    );

    // Enviar la transacción firmada
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    // Verificar el resultado
    console.log('Transacción enviada con éxito:', receipt);
}

// Ejecutar la función principal
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error en el script:", error.message);
        process.exit(1);
    });