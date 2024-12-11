//upcoin-hardhat/scripts/testnet/testnetDeploy.js

/**
 * Script para desplegar el contrato de UPCoin en la testnet de Sepolia
 * npx hardhat run scripts/testnet/testnetDeploy.js --network sepolia
 */

const {Web3} = require("web3");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

console.log('RELAYER_PRIVATE_KEY:', process.env.RELAYER_PRIVATE_KEY);
console.log('INFURA_API_URL:', process.env.INFURA_API_URL);

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_API_URL));

async function main() {
    const privateKey = `0x${process.env.RELAYER_PRIVATE_KEY.trim()}`;
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);

    console.log("Deploying contract with the account:", account.address);

    // Leer el bytecode y la ABI de UPCoin
    const upcoinPath = path.resolve(__dirname, "../../artifacts/contracts/UPCoin.sol/UPCoin.json");
    const upcoinJSON = JSON.parse(fs.readFileSync(upcoinPath, "utf8"));
    const upcoinAbi = upcoinJSON.abi;
    const upcoinBytecode = upcoinJSON.bytecode;

    // Desplegar UPCoin
    const UPCoin = new web3.eth.Contract(upcoinAbi);
    const initialSupply = 1000000 * (10 ** 2);

    const deployUpcoinTx = UPCoin.deploy({
        data: upcoinBytecode,
        arguments: [initialSupply, account.address]
    });

    const upcoinGas = await deployUpcoinTx.estimateGas({ from: account.address });
    const upcoin = await deployUpcoinTx.send({
        from: account.address,
        gas: upcoinGas,
        gasPrice: await web3.eth.getGasPrice(),
    });

    console.log("UPCoin deployed to:", upcoin.options.address);
}

main().catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
});

/**
 * Deploy 21/11
 * 
 *  Deploying contracts with the account: 0x0e627480Fd689313967b81a85b40fAa131653F51
 *  UPCoin deployed to: 0xD3BcD23F1B6d0aDA3e83C84443e2285B75F2D008
 *  Relayer deployed to: 0x86F53C5aF034dC83083F7c935b132601D66AA8eb
 */

/**
 * Deploy Dic 11
 * Deploying contract with the account: 0x0e627480Fd689313967b81a85b40fAa131653F51
 * UPCoin deployed to: 0xab4c4E5699202E2D7BB2d21E993eD2AC421b6570
 */
