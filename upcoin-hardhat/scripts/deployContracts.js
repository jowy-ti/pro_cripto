/**
 * Script para desplegar los contratos en la testnet de Sepolia
 * npx hardhat run scripts/deploy.js --network sepolia
 */

const {Web3} = require("web3");
const fs = require("fs");
const path = require("path");
require("dotenv").config(); // Carga el archivo .env en la raíz

console.log('RELAYER_PRIVATE_KEY:', process.env.RELAYER_PRIVATE_KEY);
console.log('INFURA_API_URL:', process.env.INFURA_API_URL);

// Conectar a la red (ajusta la URL de Sepolia según tu configuración)
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_API_URL));

async function main() {
    const privateKey = `0x${process.env.RELAYER_PRIVATE_KEY.trim()}`;
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);

    console.log("Deploying contracts with the account:", account.address);

    // Leer el bytecode y la ABI de UPCoin
    const upcoinPath = path.resolve(__dirname, "../artifacts/contracts/UPCoin.sol/UPCoin.json");
    const upcoinJSON = JSON.parse(fs.readFileSync(upcoinPath, "utf8"));
    const upcoinAbi = upcoinJSON.abi;
    const upcoinBytecode = upcoinJSON.bytecode;

    // Leer el bytecode y la ABI de Relayer
    const relayerPath = path.resolve(__dirname, "../artifacts/contracts/Relayer.sol/Relayer.json");
    const relayerJSON = JSON.parse(fs.readFileSync(relayerPath, "utf8"));
    const relayerAbi = relayerJSON.abi;
    const relayerBytecode = relayerJSON.bytecode;

    // Desplegar UPCoin
    const UPCoin = new web3.eth.Contract(upcoinAbi);
    const initialSupply = 1000000 * (10 ** 2);

    const deployUpcoinTx = UPCoin.deploy({
        data: upcoinBytecode,
        arguments: [initialSupply]
    });

    const upcoinGas = await deployUpcoinTx.estimateGas({ from: account.address });
    const upcoin = await deployUpcoinTx.send({
        from: account.address,
        gas: upcoinGas,
        gasPrice: await web3.eth.getGasPrice(),
    });

    console.log("UPCoin deployed to:", upcoin.options.address);

    // Desplegar Relayer
    const Relayer = new web3.eth.Contract(relayerAbi);
    const deployRelayerTx = Relayer.deploy({
        data: relayerBytecode,
        arguments: [upcoin.options.address]
    });

    const relayerGas = await deployRelayerTx.estimateGas({ from: account.address });
    const relayer = await deployRelayerTx.send({
        from: account.address,
        gas: relayerGas,
        gasPrice: await web3.eth.getGasPrice(),
    });

    console.log("Relayer deployed to:", relayer.options.address);
}

main().catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
});