// Archivo src/services/TokenService.js (puedes crear este archivo si no existe)
const API_URL = 'http://10.4.41.37:8081'; // MV
// const API_URL = 'http://localhost:3001';    // Pruebas Sebas

export const requestInitialTokens = async (userWallet) => {
  console.log("REQUEST A SERVIDOR");
  try {
    const response = await fetch(`${API_URL}/request-initial-tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userWallet }), 
    });

    const responseText = await response.json();
    console.log(`Response status: ${response.status}, Data: ${responseText}`);
    return { status: response.status, data: responseText };
  } catch (error) {
    console.log('Error al solicitar tokens iniciales:', error);
    throw error; 
  }
};
