const hre = require("hardhat");

// Ejecutar -> npx hardhat node
//          -> npx hardhat run scripts/deploy.js --network localhost

async function main() {
    console.log("Ethers version:", require("ethers").version);

    // Obtener las cuentas disponibles
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Desplegar el contrato UPCoin con suministro inicial
    const UPCoin = await hre.ethers.getContractFactory("UPCoin");
    const initialSupply = 1000000; // Suministro inicial de tokens
    const upcoin = await UPCoin.deploy(initialSupply);
    
    // Esperar a que el contrato de UPCoin esté desplegado
    await upcoin.waitForDeployment();
    console.log("UPCoin deployed to:", upcoin.target); // Mostrar dirección del contrato UPCoin

    // Desplegar el contrato Relayer con la dirección de UPCoin
    const Relayer = await hre.ethers.getContractFactory("Relayer");
    const relayer = await Relayer.deploy(upcoin.target);
    
    // Esperar a que el contrato de Relayer esté desplegado
    await relayer.waitForDeployment();
    console.log("Relayer deployed to:", relayer.target); // Mostrar dirección del contrato Relayer

    // Configurar el relayer en el contrato UPCoin
    const setRelayerTx = await upcoin.setRelayer(relayer.target);
    await setRelayerTx.wait();
    console.log(`Relayer address set in UPCoin: ${relayer.target}`);
}

// Ejecutar la función principal y manejar errores
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during deployment:", error);
        process.exit(1);
    });