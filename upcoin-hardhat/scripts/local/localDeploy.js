//upcoin-hardhat/scripts/local/localDeploy.js
const hre = require("hardhat");

// Ejecutar -> npx hardhat node
//          -> npx hardhat run scripts/local/localDeploy.js --network localhost

async function main() {
    console.log("Ethers version:", require("ethers").version);

    // Obtener las cuentas disponibles
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Desplegar el contrato UPCoin con suministro inicial
    const UPCoin = await hre.ethers.getContractFactory("UPCoin");
    const initialSupply = 1000000; // Suministro inicial de tokens
    const upcoin = await UPCoin.deploy(initialSupply, deployer.address);
    
    // Esperar a que el contrato de UPCoin esté desplegado
    await upcoin.waitForDeployment();
    console.log("UPCoin deployed to:", upcoin.target); // Mostrar dirección del contrato UPCoin
}

// Ejecutar la función principal y manejar errores
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during deployment:", error);
        process.exit(1);
    });