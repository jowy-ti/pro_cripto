import Web3 from 'web3';
import '../Styles/BlockchainPayment.css';

const web3 = new Web3(window.ethereum);

export const prepareAndSendMint = async (to, amount) => {
    try {
        // Verificar si MetaMask está instalado
        if (!window.ethereum) throw new Error("MetaMask no está instalado");

        console.log("ANTES DE HACER PETICION");

        // Obtener dirección de la cuenta conectada
        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];

        console.log("Dir: ", userAddress);

        // ABI del contrato
        const upcoinABI = [
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "initialSupply",
                  "type": "uint256"
                },
                {
                  "internalType": "address",
                  "name": "_relayer",
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
              "inputs": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                }
              ],
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
              "inputs": [
                {
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "amount",
                  "type": "uint256"
                }
              ],
              "name": "mint",
              "outputs": [],
              "stateMutability": "nonpayable",
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
              "name": "relayer",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
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

          console.log("Contrato: ", process.env.REACT_APP_UPCOIN_DEPLOY_ADDRESS);

        // Verificar que la dirección del contrato esté definida en las variables de entorno
        if (!process.env.REACT_APP_UPCOIN_DEPLOY_ADDRESS) {
            throw new Error("Dirección del contrato no definida en las variables de entorno");
        }

        console.log("Contrato: ", process.env.REACT_APP_UPCOIN_DEPLOY_ADDRESS);

        // Instanciar contrato
        const upcoinContract = new web3.eth.Contract(upcoinABI, process.env.REACT_APP_UPCOIN_DEPLOY_ADDRESS);

        // Obtener el precio del gas
        const gasPrice = await web3.eth.getGasPrice();
        console.log("Gas Price obtenido:", gasPrice);

        console.log("to: ", to);
        console.log("amount: ", amount);
        const amountInUnits = parseFloat(amount) * Math.pow(10, 2);

        // Estimar gas para la transacción
        const gasEstimate = await upcoinContract.methods.mint(to, amountInUnits).estimateGas({ from: userAddress });
        console.log("Estimación de Gas:", gasEstimate);

        // Obtener el nonce
        const nonce = await web3.eth.getTransactionCount(userAddress);
        
        // Obtener la base fee del bloque más reciente
        const block = await web3.eth.getBlock("latest");
        const baseFee = block.baseFeePerGas ? parseInt(block.baseFeePerGas) : 0; // Asegurarse que baseFee existe

        // Definir tarifas
        const maxPriorityFeePerGas = web3.utils.toWei('2', 'gwei');
        const maxFeePerGas = baseFee + parseInt(maxPriorityFeePerGas);

        // Codificar la transacción
        const txData = upcoinContract.methods.mint(to, amountInUnits).encodeABI();

        // Crear la transacción
        const tx = {
            from: userAddress,
            to: process.env.REACT_APP_UPCOIN_DEPLOY_ADDRESS,
            data: txData,
            gas: gasEstimate.toString(),
            maxFeePerGas: maxFeePerGas.toString(),
            maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
            nonce,
        };

        // Firmar la transacción con MetaMask
        const receipt = await web3.eth.sendTransaction(tx);
        console.log('Transacción firmada:', receipt);
        return receipt;
    } catch (error) {
        console.error('Error al firmar/enviar la transacción:', error.message || error);
        throw error;
    }
};