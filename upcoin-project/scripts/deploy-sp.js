const hre = require("hardhat");

// Ejecutar -> npx hardhat run scripts/deploy-sp.js --network sepolia

async function main() {
    console.log("Ethers version:", require("ethers").version);

    // Obtener las cuentas disponibles
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Obtener la fábrica del contrato
    const UPCoin = await hre.ethers.getContractFactory("UPCoin");

    // Desplegar el contrato con el suministro inicial (por ejemplo, 1,000,000 UPC)
    const initialSupply = ethers.parseUnits("1000000", 18); // Asegúrate de usar los decimales
    const upcoin = await UPCoin.deploy(initialSupply);

    // Esperar a que el contrato sea desplegado
    await upcoin.waitForDeployment();

    console.log("UPCoin deployed to:", upcoin.target); // Acceder a la dirección del contrato
}

// Ejecutar la función principal y manejar errores
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during deployment:", error);
        process.exit(1);
    });
