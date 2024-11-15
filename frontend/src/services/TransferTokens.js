// services/TransferTokens.js

// const API_URL = 'http://localhost:8081'; // Server VM
const API_URL = 'http://localhost:3001';  // Server Sebas

export const transferInitialTokens = async (amount) => {
    try {
        const response = await fetch(`${API_URL}/request-initial-tokens`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount }),  // Transferir la cantidad de UPCoin indicada
        });

        const data = await response.json();
        if (response.status === 200) {
            return { status: response.status, message: 'Transferencia de UPCoin realizada con éxito', data };
        } else {
            return { status: response.status, message: `Error: ${data.message}`, data };
        }
    } catch (error) {
        console.error('Error al realizar la transferencia:', error);
        return { status: 500, message: 'Hubo un problema al realizar la transferencia', data: error };
    }
};