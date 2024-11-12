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

    console.log('HOLA SEBAS')

    // Comprobar la red actual en MetaMask
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log('ID de la cadena actual:', currentChainId);

    // ID de la red Sepolia (0xaa36a7)
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
        params: [{ chainId: sepoliaChainId }], // Sepolia chain ID
      });

      setStatusMessage('Red Sepolia configurada correctamente.');
      console.log('Red Sepolia configurada correctamente');
      addUpcoinToken();  // Intentamos agregar el token después de cambiar la red
    } catch (error) {
      setStatusMessage('Error al configurar la red Sepolia.');
      console.error('Error al configurar la red Sepolia:', error);
    }
  };

  // Función para agregar el token UPCoin
  const addUpcoinToken = async () => {
    // Definir el token UPCoin
    const upcoinToken = {
      type: 'ERC20',
      options: {
        address: '0xa8c497025661219231Ae6A2803c57842a26F1F10', // Dirección del contrato de UPCoin
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
      <h1>Configuración de Red Sepolia y Token UPCoin</h1>
      <button className="button-configure-network-page" onClick={switchToSepolia}>
        Cambiar a Red Sepolia y Agregar UPCoin
      </button>
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
};



  /*
  //Funciona correctamente para hacer el cambio
  const switchToSepolia = async () => {
    // Verificar si MetaMask está instalado
    if (!window.ethereum) {
      setStatusMessage('MetaMask no está instalado.');
      console.log('MetaMask no está instalado');
      return;
    }

    console.log('HOLA SEBAS')

    // Comprobar la red actual en MetaMask
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log('ID de la cadena actual:', currentChainId);

    // ID de la red Sepolia (0xaa36a7)
    const sepoliaChainId = '0xaa36a7';

    // Si ya estamos en Sepolia, no es necesario hacer nada
    if (currentChainId === sepoliaChainId) {
      setStatusMessage('Ya estás conectado a la red Sepolia.');
      console.log('Ya estás en la red Sepolia');
      return;
    }

    // Si no estamos en Sepolia, intentar cambiar a Sepolia
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: sepoliaChainId }], // Sepolia chain ID
      });

      setStatusMessage('Red Sepolia configurada correctamente.');
      console.log('Red Sepolia configurada correctamente');
    } catch (error) {
      setStatusMessage('Error al configurar la red Sepolia.');
      console.error('Error al configurar la red Sepolia:', error);
    }
  };

  return (
    <div className="content-container">
      <h1>Configuración de Red Sepolia</h1>
      <button className="button-configure-network-page" onClick={switchToSepolia}>
        Cambiar a Red Sepolia
      </button>
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
};
*/


/*
const NetworkConfigurationPage = () => {
  const [statusMessage, setStatusMessage] = useState('');

  const configureNetworkAndToken = async () => {
    // Verificar si MetaMask está instalado
    if (!window.ethereum) {
      setStatusMessage('MetaMask no está instalado.');
      console.log('MetaMask no está instalado');
      return;
    }

    // Comprobar si ya estamos conectados a MetaMask
    if (!window.ethereum.selectedAddress) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Cuentas solicitadas y conectadas');
      } catch (error) {
        setStatusMessage('Error al conectar MetaMask.');
        console.error('Error al conectar MetaMask:', error);
        return;
      }
    }

    // Comprobar si MetaMask está conectado a la red correcta
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log('ID de la cadena actual:', currentChainId);

    const networkParams = {
      chainId: '0xaa36a7', // Sepolia chain ID
      chainName: 'Sepolia',
      nativeCurrency: {
        name: 'Sepolia ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: ['https://sepolia.infura.io/v3/9b04cd0ca39d47a094baeee445c12a3a'],
      blockExplorerUrls: ['https://sepolia.etherscan.io'],
    };

    const upcoinToken = {
      type: 'ERC20',
      options: {
        address: '0xa8c497025661219231Ae6A2803c57842a26F1F10', // Dirección del contrato de UPCoin
        symbol: 'UPC',
        decimals: 2,
      },
    };

    // Verificar si ya estamos conectados a la red Sepolia
    try {
      if (currentChainId !== '0xaa36a7') {
        // Si no estamos en Sepolia, agregar la red
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkParams],
        });
        setStatusMessage('Red Sepolia configurada correctamente.');
        console.log('Red Sepolia configurada correctamente');
      } else {
        setStatusMessage('Ya estás conectado a la red Sepolia.');
        console.log('Ya estás en la red Sepolia');
      }

      // Añadir el token UPC a la wallet del usuario
      console.log('Intentando agregar el token UPCoin...');
      const tokenAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: upcoinToken.type,
          options: upcoinToken.options,
        },
      });

      if (tokenAdded) {
        setStatusMessage('Red Sepolia configurada y token UPCoin agregado correctamente.');
        console.log('Token UPCoin agregado');
      } else {
        setStatusMessage('Red Sepolia configurada correctamente, pero no se pudo agregar el token UPCoin.');
        console.log('No se pudo agregar el token UPCoin');
      }
    } catch (error) {
      console.error('Error al configurar la red Sepolia o agregar el token UPCoin:', error);
      setStatusMessage(`Error al configurar la red Sepolia o agregar el token UPCoin: ${error.message}`);
    }
  };

  return (
    <div className="content-container">
      <h1>Configuración de Red Sepolia</h1>
      <button className="button-configure-network-page" onClick={configureNetworkAndToken}>
        Configurar Red Sepolia y Agregar UPCoin
      </button>
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
};
*/

export default NetworkConfigurationPage;