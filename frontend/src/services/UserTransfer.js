// src/services/UserTransfer.js

const API_URL = 'http://10.4.41.37:8081';

/**
 * Envía los datos de transferencia al backend.
 * @param {object} paymentData Objeto con los datos de la transferencia.
 * @returns {Promise<object>} Respuesta del backend.
 */
export const sendPayment = async (paymentData) => {
    try {
        const response = await fetch(`${API_URL}/relay-transfer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
        });

        const responseText = await response.json();
        console.log(`Response status: ${response.status}, Data: ${responseText}`);
        return { status: response.status, data: responseText };
    } catch (error) {
        console.error('Error al enviar datos de transferencia:', error);
        throw error;
    }
};