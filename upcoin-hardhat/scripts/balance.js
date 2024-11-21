const {Web3} = require("web3");
const fs = require("fs");
const path = require("path");

// Conectar a tu nodo local de Hardhat (reemplaza con la URL correcta si es diferente)
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

// Direcciones de las wallets a consultar
const wallets = [
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", 
  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
];

// Dirección del contrato desplegado UPCoin
const upcoinAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Cambia esta dirección si es necesario

// Cargar ABI del contrato UPCoin
const abiPath = path.join(__dirname, "../artifacts/contracts/UPCoin.sol/UPCoin.json");
const upcoinABI = JSON.parse(fs.readFileSync(abiPath, "utf-8")).abi;

// Crear una instancia del contrato UPCoin
const upcoinContract = new web3.eth.Contract(upcoinABI, upcoinAddress);

async function getUPCBalance(address) {
  try {
    // Consultar saldo de UPC
    const balance = await upcoinContract.methods.balanceOf(address).call();
    return balance;

  } catch (error) {
    console.error("Error al obtener el saldo de UPC:", error);
    return 0;
  }
}

async function main() {
  for (const wallet of wallets) {
    const balance = await getUPCBalance(wallet);
    console.log(`Saldo de UPC de ${wallet}: ${balance}`); 
  }
}

main();