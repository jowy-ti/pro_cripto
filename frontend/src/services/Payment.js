const API_URL = 'http://10.4.41.37:8081';//;'http://localhost:3001'

export const sendPayment = async (paymentData) => {
    try {
        const response = await fetch(`${API_URL}/relay-transfer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
        });
        //if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const responseText = await response.json();//.json()
        console.log(`Response status: ${response.status}, Data: ${responseText}`);
        return {status: response.status, data: responseText};
    } catch (error) {
        console.log('error');
        throw error;
    }
};
