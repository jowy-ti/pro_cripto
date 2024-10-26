import axios from 'axios';

const API_URL = '???????????????????';

export const sendPayment = async (paymentData) => {
    try {
        const response = await axios.post(`${API_URL}/blockchainPayment`, paymentData);
        return response.data;
    } catch (error) {
        console.error('Error en al enviar el pago');
        throw error;
    }
};