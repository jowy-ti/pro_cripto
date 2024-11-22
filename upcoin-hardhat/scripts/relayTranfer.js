
//EL SCRIPT FUNCIONA CORRECTAMENTE

const {Web3} = require('web3');
const fetch = require('node-fetch'); // Asegúrate de instalar este módulo con: npm install node-fetch@2
const API_URL = 'http://localhost:3001/relay-transfer'; // URL del endpoint

// Configuración
const privateKey = '0xea172cb11f00d1c9bc14c4a312f1a944a9a67f67e1b0dfe3f30b45d0a0b92078'; // Reemplaza con una clave privada válida
const fromAddress = '0x77877B3b2c4EEc21139CF41638633F35706f43BC'; // Reemplaza con la dirección asociada a la clave privada
const toAddress = '0x2b41659B028269Fe71E6683c7240294cdD9607e1'; // Dirección del destinatario
const amount = 25 * Math.pow(10, 2); // Cantidad (100 UPCoin * 10^2 por los 2 decimales)

// Inicializa Web3
const web3 = new Web3();

(async () => {
    try {
        // Genera el hash esperado por el contrato
        const messageHash = web3.utils.soliditySha3(
            { type: 'address', value: fromAddress },
            { type: 'address', value: toAddress },
            { type: 'uint256', value: amount }
        );

        // Firma el hash
        const { signature } = web3.eth.accounts.sign(messageHash, privateKey);
        console.log('Firma generada:', signature);

        // Datos del pago
        const paymentData = {
            signature,
            from: fromAddress,
            to: toAddress,
            amount: amount,
        };

        console.log('Enviando datos al servidor:', paymentData);

        // Llamada al endpoint
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
        });

        // Procesa la respuesta del servidor
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Respuesta del servidor:', responseData);

    } catch (error) {
        console.error('Error durante la simulación:', error.message);
    }
})();