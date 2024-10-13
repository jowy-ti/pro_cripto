// scripts/interact.js
// ejecutar -> npx hardhat run scripts/interact.js --network localhost 
const hre = require("hardhat");
const { ethers } = hre;


async function main() {
    // getSigners -> obtener las direcciones de la cuentas disponibles de la red
    // owner cuenta que desplego el contrato (1ra)
    // addr1 cuenta para hacer transferencia (2na)
    const [owner, addr1] = await ethers.getSigners();

    // crear instancia de contrato
    const UPCoin = await ethers.getContractFactory("UPCoin");

    // attach para conectar con la instancia del contrato desplegado
    const upcoin = await UPCoin.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3"); 
    // 0x5FC.. <- UPCoin deployed to:... despues de haber ejecutado deploy.js

    // Consultar el balance del propietario
    const balance = await upcoin.balanceOf(owner.address);
    console.log(`Balance de ${owner.address}:`, formatBalance(balance));

    // Transferir tokens
    const amount = ethers.parseUnits("100", 18); // 100 UPC, con 18 decimales -> 100 * 10^18
    await upcoin.transfer(addr1.address, amount);
    console.log(`Transferidos ${formatBalance(amount)} UPC a ${addr1.address}`);

    const newBalanceOwner = await upcoin.balanceOf(owner.address);
    console.log(`Nuevo balance de ${owner.address}:`, formatBalance(newBalanceOwner));

    // Consultar el balance después de la transferencia
    const newBalance = await upcoin.balanceOf(addr1.address);
    console.log(`Nuevo balance de ${addr1.address}:`, formatBalance(newBalance));
}

// Función para formatear el balance a un número decimal legible
function formatBalance(balance) {
    // Convertir el saldo a un número decimal con 18 decimales
    return ethers.formatUnits(balance, 18); // Esto devuelve el valor como cadena con el formato adecuado
}

// Ejecutar la función principal y manejar errores
main()
    .then(() => process.exit(0))   
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

