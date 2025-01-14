//upcoin-hardhat/scripts/local/balance.js
const { Web3 } = require("web3");
const fs = require("fs");
const path = require("path");

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545")); // Configuración de la red local: Hardhat local node

// Direcciones de las wallets a consultar
const wallets = [
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
];

// Dirección del contrato desplegado UPCoin
const upcoinAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Cargar ABI del contrato UPCoin
const abiPath = path.join(__dirname, "../../artifacts/contracts/UPCoin.sol/UPCoin.json");
const upcoinABI = JSON.parse(fs.readFileSync(abiPath, "utf-8")).abi;

// Crear una instancia del contrato UPCoin
const upcoinContract = new web3.eth.Contract(upcoinABI, upcoinAddress);

async function getUPCBalance(address) {
  try {
    // Consultar saldo de UPC
    const balance = await upcoinContract.methods.balanceOf(address).call();
    return balance;
  } catch (error) {
    console.error(`Error al obtener el saldo de UPC para ${address}:`, error);
    return 0;
  }
}

async function getETHBalance(address) {
  try {
    // Consultar saldo de ETH
    const balance = await web3.eth.getBalance(address);
    // Convertir el saldo de Wei a ETH para mayor legibilidad
    return web3.utils.fromWei(balance, "ether");
  } catch (error) {
    console.error(`Error al obtener el saldo de ETH para ${address}:`, error);
    return 0;
  }
}

async function main() {
  for (const wallet of wallets) {
    // Obtener el saldo de UPC y ETH
    const upcBalance = await getUPCBalance(wallet);
    const ethBalance = await getETHBalance(wallet);

    console.log(`Wallet: ${wallet}`);
    console.log(`  Saldo de UPC: ${upcBalance}`);
    console.log(`  Saldo de ETH: ${ethBalance} ETH`);
  }
}

main().catch((error) => {
  console.error("Error en el script:", error.message);
});