// src/pages/ClaimTokensPage.jsx

import React, { useState } from 'react';
import { claimInitialsTokens } from '../services/ClaimTokens';
import '../components/Styles/NetworkConfigurationPage.css';

const ClaimTokensPage = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingMessage, setLoadingMessage] = useState(false); 
  const [successMessage, setSuccessMessage] = useState(null);

  const handleRequestTokens = async () => {
    setLoadingMessage(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const userWallet = await window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => accounts[0]);

      const { status, data } = await claimInitialsTokens(userWallet);

      if (status === 200) {
        setSuccessMessage('Tokens enviados correctamente');
        setTimeout(() => { setSuccessMessage(''); }, 1000);
      } else {
        setErrorMessage('Hubo un error al solicitar los tokens');
        setTimeout(() => { setErrorMessage(''); }, 1000);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Hubo un error al solicitar los tokens');
      setTimeout(() => { setErrorMessage(''); }, 1000);
    } finally {
      setLoadingMessage(false);
    }
  }

  return (
    <div className="claim-tokens-container">
      <h1>Consigue tus primeros 100 UPCoins</h1>
      <p>Como nuevo usuario, tienes la oportunidad de recibir tus primeros 100 UPCoin.<br/> Puedes reclamar esta cantidad una sola vez por wallet.<br/>Haz clic en el botón para completar el proceso y obtener tus tokens iniciales.</p>
      <button onClick={handleRequestTokens}>Reclamar 100 UPCoins</button>
      {errorMessage && <p className='error-message'>{errorMessage}</p>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      {loadingMessage && <div style={{ color: 'green' }}>{'Solicitando Tokens...'} </div>}
    </div>
  );
};

export default ClaimTokensPage;