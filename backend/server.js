const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importar cors
const {Web3} = require('web3');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_API_URL));

// Dirección del contrato del Relayer
const relayerAddress = '0x4cB654441C5971b73179DDe42F02f26E7cf3e287';
const relayerABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_upcoinAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "signature",
          "type": "bytes"
        }
      ],
      "name": "relayTransfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "upcoin",
      "outputs": [
        {
          "internalType": "contract UPCoin",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
];
const relayerContract = new web3.eth.Contract(relayerABI, relayerAddress);

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
            to: relayerAddress,
            data: relayerContract.methods.relayTransfer(from, to, amount, signature).encodeABI(),
            gas: gasEstimate,
            gasPrice,
            nonce,
            //from: from,
            from: process.env.RELAYER_ADDRESS,
        };

        // Firmar la transacción
        const signedTx = await web3.eth.accounts.signTransaction(txData, process.env.PRIVATE_KEY); // original


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

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Ejecutar servidor -> node server.js