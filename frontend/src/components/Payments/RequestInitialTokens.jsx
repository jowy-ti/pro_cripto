import React, { useState, useEffect } from 'react';
import { requestInitialTokens } from '../../services/TransferTokens'; 
import '../Styles/BlockchainPayment.css'; 

const BlockchainInitialTokens = () => {
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const checkMetaMaskConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);
        } catch (error) {
          console.error("Error al conectarse a MetaMask", error);
          setErrorMessage("Fallo al conectarse a MetaMask. Comprueba si está instalado y desbloqueado");
        }
      } else {
        setErrorMessage("MetaMask no está instalado. Instálalo para poder reclamar tokens.");
      }
    };

    checkMetaMaskConnection();
  }, []);

  const handleRequestTokens = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (!window.ethereum) throw new Error("MetaMask no está instalado");

      console.log("ANTES DE HACER PETICION");

      // Llamar a la función para solicitar los tokens
      const { status, data } = await requestInitialTokens(account);

      if (status === 200) {
        console.log(data);
        setSuccessMessage('Tokens solicitados correctamente');
        setTimeout(() => { setSuccessMessage(''); }, 1000);
      } else {
        setErrorMessage(`Error al solicitar tokens: ${status}`);
        setTimeout(() => { setErrorMessage(''); }, 1000);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Ha ocurrido un error al solicitar los tokens');
      setTimeout(() => { setErrorMessage(''); }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='blockchain-payment'>
      <h2>Reclamar Tokens Iniciales</h2>
      {account ? (
        <p className='txt'>Cuenta conectada: {account}</p>
      ) : (
        <p>Por favor, conecta tu cuenta de MetaMask wallet</p>
      )}
      <form onSubmit={handleRequestTokens}>
        <button className='pay' type='submit' disabled={!account || loading}>
          {loading ? 'Solicitando...' : 'Reclamar 100 UPCoin'}
        </button>
      </form>
      {errorMessage && <p className='errorMessage'>{errorMessage}</p>}
      {successMessage && <p className='successMessage'>{successMessage}</p>}
    </div>
  );
};

export default BlockchainInitialTokens;

