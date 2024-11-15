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

const upcoinAddres = '0xa8c497025661219231Ae6A2803c57842a26F1F10';
const upcoinABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "initialSupply",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "allowance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "needed",
        "type": "uint256"
      }
    ],
    "name": "ERC20InsufficientAllowance",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "needed",
        "type": "uint256"
      }
    ],
    "name": "ERC20InsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "approver",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidSender",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidSpender",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
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
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
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
    "name": "transferWithSignature",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const upcoinContract = new web3.eth.Contract(upcoinABI, upcoinAddres);


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


// Endpoint para realizar la transferencia de tokens iniciales
app.post('/request-initial-tokens', async (req, res) => {
  const { amount, userWallet } = req.body;
  console.log("Solicitud de tokens iniciales recibida. Cantidad a transferir:", amount);
  console.log("Wallet usuario: ", userWallet);

  if (!userWallet) {
      return res.status(400).json({ error: 'Se debe proporcionar una dirección de wallet del usuario.' });
  }

  try {
      // Validar que la cantidad de tokens sea mayor que 0
      if (amount <= 0) {
          return res.status(400).json({ error: 'La cantidad a transferir debe ser mayor a 0.' });
      }

      // Configurar los datos de la transferencia (usando la cuenta del relayer)
      const from = process.env.RELAYER_ADDRESS; // Usar la dirección del relayer
      const to = userWallet; // Dirección del usuario
      const amountInWei = web3.utils.toWei(amount.toString(), 'ether'); // Convertir la cantidad a Wei

      console.log("TEST .......");

      // Llamar a la función transfer del contrato ERC20
      const gasPrice = await web3.eth.getGasPrice();
      console.log("TEST 1.......");
      const gasEstimate = await upcoinContract.methods.transfer(to, amountInWei).estimateGas({ from });
      console.log("TEST 1.2.......");
      const nonce = await web3.eth.getTransactionCount(from);

      console.log("TEST 2.......");
      
      const txData = {
          to: process.env.upcoinAddres,  // Dirección del contrato ERC20
          data: upcoinContract.methods.transfer(to, amountInWei).encodeABI(),
          gas: gasEstimate,
          gasPrice,
          nonce,
          from: process.env.RELAYER_ADDRESS,
      };

      console.log("TEST 3.......");

      // Firmar la transacción
      const signedTx = await web3.eth.accounts.signTransaction(txData, process.env.PRIVATE_KEY);

      console.log("TEST 4.......");


      // Enviar la transacción firmada
      const tx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

      console.log("Transacción de tokens iniciales:", tx);

      res.json({
          message: 'Tokens iniciales transferidos con éxito',
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
      console.error("Error en la transferencia de tokens iniciales:", error);
      res.status(500).json({ error: 'Error al realizar la transferencia de tokens iniciales' });
  }
});








// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Ejecutar servidor -> node server.js