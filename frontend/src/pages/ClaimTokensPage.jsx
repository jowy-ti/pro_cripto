// src/pages/ClaimTokensPage.jsx

import React, { useState } from 'react';
import { claimInitialsTokens } from '../services/ClaimTokens';
import '../components/Styles/ClaimTokensPage.css';

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

      console.log("MENSAJE ERROR: ", data.error);

      if (status === 200) {
        setSuccessMessage('Tokens enviados correctamente. ¡Disfruta de tus 100 UPC!');
        setTimeout(() => setSuccessMessage(''), 5000); // Mensaje visible durante 5 segundos
      } else if (status === 400 && data.error === 'Los tokens ya fueron reclamados por esta dirección') {
        setErrorMessage('Ya has reclamado tus tokens iniciales. Solo puedes hacerlo una vez.');
        setTimeout(() => setErrorMessage(''), 5000); // Mensaje visible durante 5 segundos
      } else {
        setErrorMessage('Hubo un error al solicitar los tokens. Intenta nuevamente.');
        setTimeout(() => setErrorMessage(''), 5000); // Mensaje visible durante 5 segundos
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Hubo un error al solicitar los tokens. Intenta nuevamente.');
      setTimeout(() => setErrorMessage(''), 5000); // Mensaje visible durante 5 segundos
    } finally {
      setLoadingMessage(false);
    }
  };

  return (
    <div className="content-container">
      <h1>Consigue tus primeros 100 UPCoins</h1>
      <p>
        Como nuevo usuario, tienes la oportunidad de recibir tus primeros 100 UPCoin.<br/>
        Puedes reclamar esta cantidad una sola vez por wallet.<br/>
        Haz clic en el botón para completar el proceso y obtener tus tokens iniciales.
      </p>
      <button className="button-claim-tokens" onClick={handleRequestTokens}>
        Reclamar 100 UPCoins
      </button>
      {errorMessage && <div className="status-message error">{errorMessage}</div>}
      {successMessage && <div className="status-message success">{successMessage}</div>}
      {loadingMessage && <div className="status-message loading">Solicitando Tokens...</div>}
    </div>
  );
};

export default ClaimTokensPage;