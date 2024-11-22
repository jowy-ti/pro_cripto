const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importar cors
const {Web3} = require('web3');
require('dotenv').config();
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_API_URL));

// Cargar ABI del contrato UPCoin
const abiPath = path.join(__dirname, "../upcoin-hardhat/artifacts/contracts/UPCoin.sol/UPCoin.json");
const upcoinABI = JSON.parse(fs.readFileSync(abiPath, "utf-8")).abi;
const upcoinContract = new web3.eth.Contract(upcoinABI, process.env.UPCOIN_DEPLOY_ADDRESS);

const relayerAbiPath = path.join(__dirname, "../upcoin-hardhat/artifacts/contracts/Relayer.sol/Relayer.json");
const relayerABI = JSON.parse(fs.readFileSync(relayerAbiPath, "utf-8")).abi;
const relayerContract = new web3.eth.Contract(relayerABI, process.env.RELAYER_DEPLOY_ADDRESS);


// Endpoint para realizar la transferencia
app.post('/relay-transfer', async (req, res) => {
    const { from, to, amount, signature } = req.body;
    console.log("Datos recibidos:", req.body);

    try {
        console.log("Validando firma...");
        const gasPrice = await web3.eth.getGasPrice();
        console.log("Gas Price obtenido:", gasPrice);

        const gasEstimate = await relayerContract.methods.relayTransfer(from, to, amount, signature).estimateGas({ from });
        console.log("Estimación de Gas:", gasEstimate);

        const nonce = await web3.eth.getTransactionCount(process.env.RELAYER_ADDRESS);

        const txData = {
            to: process.env.RELAYER_DEPLOY_ADDRESS,
            data: relayerContract.methods.relayTransfer(from, to, amount, signature).encodeABI(),
            gas: gasEstimate,
            gasPrice,
            nonce,
            from: process.env.RELAYER_ADDRESS,
        };

        // Firmar la transacción
        const signedTx = await web3.eth.accounts.signTransaction(txData, process.env.RELAYER_PRIVATE_KEY); // TODO


        // Enviar la transacción firmada
        const tx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log("Transacción:", tx);
        console.log("FIN TRANSACCIÓN");

        //res.json({ message: 'Transferencia realizada', tx });
        res.json({
            message: 'Transferencia realizada',
            tx: {
                blockHash: tx.blockHash,
                blockNumber: tx.blockNumber.toString(), // Convertir blockNumber a cadena
                cumulativeGasUsed: tx.cumulativeGasUsed.toString(), // Convertir cumulativeGasUsed a cadena
                effectiveGasPrice: tx.effectiveGasPrice.toString(), // Convertir effectiveGasPrice a cadena
                from: tx.from,
                gasUsed: tx.gasUsed.toString(), // Convertir gasUsed a cadena
                logs: tx.logs.map(log => ({
                    ...log,
                    blockNumber: log.blockNumber.toString(), // Convertir blockNumber en logs a cadena
                    logIndex: log.logIndex.toString(), // Convertir logIndex a cadena
                    transactionIndex: log.transactionIndex.toString(), // Convertir transactionIndex a cadena
                })),
                logsBloom: tx.logsBloom,
                status: tx.status.toString(), // Convertir status a cadena
                to: tx.to,
                transactionHash: tx.transactionHash,
                transactionIndex: tx.transactionIndex.toString(), // Convertir transactionIndex a cadena
                type: tx.type.toString(), // Convertir type a cadena
            },
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en la transferencia' });
    }
});


// Endpoint para realizar la transferencia de tokens iniciales
app.post('/request-initial-tokens', async (req, res) => {
  const { userWallet } = req.body;

  console.log("userWallet : " + userWallet);

  try {
    // Obtener el nonce de la transacción
    const nonce = await web3.eth.getTransactionCount(process.env.RELAYER_ADDRESS);

    console.log("nonce");

    // Construir la transacción para llamar a `transfer` del contrato UPCoin
    const amount = 100 * (10 ** 2); // 100 UPCoin con 2 decimales
    const gasEstimate = await upcoinContract.methods.transfer(userWallet, amount).estimateGas({ from: process.env.RELAYER_ADDRESS });
    const txData = {
      to: process.env.UPCOIN_DEPLOY_ADDRESS, // Dirección del contrato UPCoin
      data: upcoinContract.methods.transfer(userWallet, amount).encodeABI(),
      gas: gasEstimate, // Estimar el gas necesario (ajusta según sea necesario)
      gasPrice: await web3.eth.getGasPrice(),
      nonce: nonce,
      from: process.env.RELAYER_ADDRESS,
    };

    // Firmar la transacción con la clave privada del Relayer
    const signedTx = await web3.eth.accounts.signTransaction(txData, process.env.RELAYER_PRIVATE_KEY); //TODO
    console.log("1");

    // Enviar la transacción firmada
    const tx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("2");

    console.log("Transacción:", tx);
    console.log("FIN TRANSACCIÓN");


    //res.json({ message: 'Tokens enviados correctamente', tx });
    res.json({
      message: 'Tokens enviados correctamente',
      tx: {
          blockHash: tx.blockHash,
          blockNumber: tx.blockNumber.toString(), // Convertir blockNumber a cadena
          cumulativeGasUsed: tx.cumulativeGasUsed.toString(), // Convertir cumulativeGasUsed a cadena
          effectiveGasPrice: tx.effectiveGasPrice.toString(), // Convertir effectiveGasPrice a cadena
          from: tx.from,
          gasUsed: tx.gasUsed.toString(), // Convertir gasUsed a cadena
          logs: tx.logs.map(log => ({
              ...log,
              blockNumber: log.blockNumber.toString(), // Convertir blockNumber en logs a cadena
              logIndex: log.logIndex.toString(), // Convertir logIndex a cadena
              transactionIndex: log.transactionIndex.toString(), // Convertir transactionIndex a cadena
          })),
          logsBloom: tx.logsBloom,
          status: tx.status.toString(), // Convertir status a cadena
          to: tx.to,
          transactionHash: tx.transactionHash,
          transactionIndex: tx.transactionIndex.toString(), // Convertir transactionIndex a cadena
          type: tx.type.toString(), // Convertir type a cadena
      },
  });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al enviar los tokens' });
  }
});

// Endpoint para reclamar los tokens iniciales
app.post('/claim-tokens', async (req, res) => {
  const { userWallet } = req.body;

  console.log("(ct) userWallet : " + userWallet);

  try {
    // Obtener el nonce para la transacción
    const nonce = await web3.eth.getTransactionCount(process.env.RELAYER_ADDRESS);

    console.log("nonce obtenido:", nonce);

    // Estimar el gas necesario para la transacción
    const gasEstimate = await relayerContract.methods.relayClaimTokens(userWallet).estimateGas({ from: process.env.RELAYER_ADDRESS});

    const block = await web3.eth.getBlock("latest");
    const baseFee = parseInt(block.baseFeePerGas); // Tarifa base actual

    // Ajustar valores dinámicamente
    const maxPriorityFeePerGas = web3.utils.toWei('2', 'gwei'); // 2 gwei
    const maxFeePerGas = baseFee + parseInt(maxPriorityFeePerGas);

    // Construir los datos de la transacción
    const txData = {
      to: process.env.RELAYER_DEPLOY_ADDRESS,
      data: relayerContract.methods.relayClaimTokens(userWallet).encodeABI(), // data: upcoinContract.methods.claimTokens(userWallet).encodeABI(),
      gas: gasEstimate.toString(), // Convertir gas a cadena
      //gasPrice: (await web3.eth.getGasPrice()).toString(), // Convertir gasPrice a cadena
      nonce: nonce,
      maxFeePerGas: maxFeePerGas.toString(), // Máximo calculado dinámicamente
      maxPriorityFeePerGas: maxPriorityFeePerGas.toString(), // Incentivo ajustado
      from: process.env.RELAYER_ADDRESS, // Dirección del relayer
    };

    console.log("txData construido:", txData);

    // Firmar la transacción con la clave privada del Relayer
    const signedTx = await web3.eth.accounts.signTransaction(txData, process.env.RELAYER_PRIVATE_KEY);

    console.log("Transacción firmada");

    // Enviar la transacción firmada
    const tx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log("Transacción enviada:", tx);

    // Responder al cliente con los detalles de la transacción
    res.json({
      message: 'Tokens reclamados correctamente',
      tx: {
        blockHash: tx.blockHash,
        blockNumber: tx.blockNumber.toString(),
        cumulativeGasUsed: tx.cumulativeGasUsed.toString(),
        effectiveGasPrice: tx.effectiveGasPrice.toString(),
        from: tx.from,
        gasUsed: tx.gasUsed.toString(),
        logs: tx.logs.map(log => ({
          ...log,
          blockNumber: log.blockNumber.toString(),
          logIndex: log.logIndex.toString(),
          transactionIndex: log.transactionIndex.toString(),
        })),
        logsBloom: tx.logsBloom,
        status: tx.status.toString(),
        to: tx.to,
        transactionHash: tx.transactionHash,
        transactionIndex: tx.transactionIndex.toString(),
        type: tx.type.toString(),
      },
    });
  } catch (error) {
    console.error("Error al reclamar tokens:", error);
    res.status(500).json({ error: 'Error al reclamar los tokens' });
  }
});


// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Ejecutar servidor -> node server.js