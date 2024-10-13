const hre = require("hardhat");

async function main() {
    
    console.log("Ethers version:", require("ethers").version);

    // Obtener las cuentas disponibles
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Obtener la fábrica del contrato
    const UPCoin = await hre.ethers.getContractFactory("UPCoin");

    // Desplegar el contrato con el suministro inicial (por ejemplo, 1,000,000 UPC)
    const initialSupply = 1000000;
    const upcoin = await UPCoin.deploy(initialSupply);

    await upcoin.waitForDeployment(); // Aquí usamos waitForDeployment()

    console.log("UPCoin deployed to:", upcoin.target); // Acceder a la dirección del contrato
}

// Ejecutar la función principal y manejar errores
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during deployment:", error);
        process.exit(1);
    });

