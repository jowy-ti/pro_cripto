const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Using deployer account:", deployer.address);

    // Dirección del contrato UPCoin
    const upcoinAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // Dirección de UPCoin
    const upcoin = await hre.ethers.getContractFactory("UPCoin");
    const upcoinInstance = upcoin.attach(upcoinAddress);

    // Dirección del destinatario
    const recipientAddress = "0xRecipientAddress"; // Dirección a la que se van a enviar los tokens
    const amount = hre.ethers.utils.parseUnits("100", 2); // 100 tokens con 2 decimales

    // Minting de tokens
    const tx = await upcoinInstance.mint(recipientAddress, amount);
    await tx.wait();
    console.log(`Minted ${hre.ethers.utils.formatUnits(amount, 2)} tokens to ${recipientAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error minting tokens:", error);
        process.exit(1);
    });