// src/pages/NetworkConfigurationPage.jsx

import React, { useState } from 'react';
import '../components/Styles/NetworkConfigurationPage.css';

const NetworkConfigurationPage = () => {
  const [statusMessage, setStatusMessage] = useState('');

  const switchToSepolia = async () => {
    // Verificar si MetaMask está instalado
    if (!window.ethereum) {
      setStatusMessage('MetaMask no está instalado.');
      console.log('MetaMask no está instalado');
      return;
    }

    // Comprobar la red actual en MetaMask
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log('ID de la cadena actual:', currentChainId);

    // ID de la red Sepolia
    const sepoliaChainId = '0xaa36a7';

    // Si ya estamos en Sepolia, no es necesario hacer nada
    if (currentChainId === sepoliaChainId) {
      setStatusMessage('Ya estás conectado a la red Sepolia.');
      console.log('Ya estás en la red Sepolia');
      addUpcoinToken();  // Intentamos agregar el token si ya estamos en la red correcta
      return;
    }

    // Si no estamos en Sepolia, intentar cambiar a Sepolia
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: sepoliaChainId }],
      });

      setStatusMessage('Red Sepolia configurada correctamente.');
      console.log('Red Sepolia configurada correctamente');
      addUpcoinToken();  // Intentamos agregar el token después de cambiar la red
    } catch (error) {
      setStatusMessage('Error al configurar la red Sepolia.');
      console.error('Error al configurar la red Sepolia:', error);
    }
  };

  console.log("UPCOIN_DEPLOY_ADDRESS: ", process.env.REACT_APP_UPCOIN_DEPLOY_ADDRESS );

  // Función para agregar el token UPCoin
  const addUpcoinToken = async () => {
    // Definir el token UPCoin
    const upcoinToken = {
      type: 'ERC20',
      options: {
        address: process.env.REACT_APP_UPCOIN_DEPLOY_ADDRESS, // Dirección del contrato de UPCoin
        symbol: 'UPC',
        decimals: 2,
      },
    };

    // Intentar agregar el token UPCoin a la wallet de MetaMask
    try {
      console.log('Intentando agregar el token UPCoin...');
      const tokenAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: upcoinToken.type,
          options: upcoinToken.options,
        },
      });

      if (tokenAdded) {
        setStatusMessage('Token UPCoin agregado correctamente.');
        console.log('Token UPCoin agregado');
      } else {
        setStatusMessage('No se pudo agregar el token UPCoin.');
        console.log('No se pudo agregar el token UPCoin');
      }
    } catch (error) {
      setStatusMessage('Error al agregar el token UPCoin.');
      console.error('Error al agregar el token UPCoin:', error);
    }
  };

  return (
    <div className="content-container">
      <h1>Empezar a utilizar UPCoin</h1>
      <p>Para empezar a utilizar UPCoin es necesario configurar la red y añadir el token.</p>

      <button className="button-configure-network-page" onClick={switchToSepolia}>
        Configurar red y Agregar UPCoin
      </button>
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
};

export default NetworkConfigurationPage;