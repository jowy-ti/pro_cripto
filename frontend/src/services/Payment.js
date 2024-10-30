import axios from 'axios';

const API_URL = 'http://back:5000';

export const sendPayment = async (paymentData) => {
    try {
        const response = await axios.post(`${API_URL}/relay-transfer`, paymentData);
        return response;
    } catch (error) {
        console.error('Error en al enviar el pago');
        throw error;
    }
};
