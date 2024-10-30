const Web3 = require('web3');
const web3 = new Web3(); // Asegúrate de tener el proveedor configurado si es necesario

async function signTransaction(signer, to, amount, upcoinAddress) {
    const domain = {
        name: "UPCoin",
        version: "1",
        chainId: 11155111, // ID de Sepolia
        verifyingContract: upcoinAddress,
    };

    const types = {
        Transfer: [
            { name: "from", type: "address" },
            { name: "to", type: "address" },
            { name: "amount", type: "uint256" },
        ],
    };

    const value = {
        from: signer, // Asegúrate de pasar la dirección del firmante
        to: to,
        amount: web3.utils.toBN(web3.utils.toWei(amount.toString(), 'ether')).div(web3.utils.toBN(100)) // Ajustar según los decimales
    };

    // Genera la firma usando web3.eth.accounts.signTypedData
    const signature = await web3.eth.accounts.signTypedData(value, signer);
    return signature;
}

module.exports = { signTransaction };
