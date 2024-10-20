// scripts/interact.js
// ejecutar -> npx hardhat run scripts/interact.js --network localhost 
const Web3 = require('web3').default;
const hre = require("hardhat");

async function main() {
    const web3 = new Web3("http://127.0.0.1:8545"); // Conectar a la red local
    const accounts = await web3.eth.getAccounts(); // Obtener las cuentas disponibles

    // owner cuenta que desplegó el contrato (1ra)
    const owner = accounts[0];
    // addr1 cuenta para hacer transferencia (2na)
    const addr1 = accounts[1];

    // Crear instancia del contrato usando la ABI y la dirección del contrato
    const UPCoin = require("../artifacts/contracts/UPCoin.sol/UPCoin.json");
    const upcoin = new web3.eth.Contract(UPCoin.abi, "0x5FbDB2315678afecb367f032d93F642f64180aa3"); // Dirección del contrato

    // Consultar el balance del propietario
    const balance = await upcoin.methods.balanceOf(owner).call();
    console.log(`Balance de ${owner}:`, formatBalance(balance));

    // Transferir tokens
    const amount = web3.utils.toWei("100", "ether"); // 100 UPC, con 18 decimales -> 100 * 10^18
    await upcoin.methods.transfer(addr1, amount).send({ from: owner });
    console.log(`Transferidos ${formatBalance(amount)} UPC a ${addr1}`);

    const newBalanceOwner = await upcoin.methods.balanceOf(owner).call();
    console.log(`Nuevo balance de ${owner}:`, formatBalance(newBalanceOwner));

    // Consultar el balance después de la transferencia
    const newBalance = await upcoin.methods.balanceOf(addr1).call();
    console.log(`Nuevo balance de ${addr1}:`, formatBalance(newBalance));
}

// Función para formatear el balance a un número decimal legible
function formatBalance(balance) {
    // Convertir el saldo a un número decimal con 18 decimales
    return Web3.utils.fromWei(balance, "ether"); // Esto devuelve el valor como cadena con el formato adecuado
}

// Ejecutar la función principal y manejar errores
main()
    .then(() => process.exit(0))   
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


// dirección del contrato desplegado en sepolia 0x3878ecED3ad9a37dD8f3D620d7A0b62f1a90535B