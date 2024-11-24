// src/components/Payments/TransferTokens.js
import Web3 from 'web3';
import { sendPayment } from '../../services/UserTransfer'; // Cambia la ruta relativa

/**
 * Prepara los datos de transferencia y los envía al backend.
 * @param {string} from Dirección del remitente.
 * @param {string} to Dirección del destinatario.
 * @param {number} amount Cantidad de tokens en unidades (considerando decimales).
 * @returns {Promise<object>} Respuesta del backend.
 */
export const prepareAndSendPayment = async (from, to, amount) => {
    try {
        if (!window.ethereum) throw new Error("MetaMask no está instalado");

        const web3 = new Web3(window.ethereum);

        // Generar hash del mensaje
        const messageHash = web3.utils.soliditySha3(
            { type: 'address', value: from },
            { type: 'address', value: to },
            { type: 'uint256', value: amount }
        );

        console.log("Hash del mensaje generado:", messageHash);

        // Solicitar firma del hash en MetaMask
        // Firmar el hash con MetaMask (sin aplicar prefijos manuales)
        const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [messageHash, from],
        });

        console.log("Firma generada:", signature);

        // Crear objeto de datos de transferencia
        const paymentData = { signature, from, to, amount };

        // Enviar los datos al backend
        return await sendPayment(paymentData);
    } catch (error) {
        console.error("Error al preparar o enviar la transferencia:", error);
        throw error;
    }
};