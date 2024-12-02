import React, { useState } from 'react';
import { claimInitialsTokens } from '../services/ClaimTokens';
import '../components/Styles/NetworkConfigurationPage.css';

const NetworkConfigurationPage = () => {
  const [statusMessage, setStatusMessage] = useState('');
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('configurar'); // Pestaña activa

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
      addUpcoinToken(); // Intentamos agregar el token si ya estamos en la red correcta
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
      addUpcoinToken(); // Intentamos agregar el token después de cambiar la red
    } catch (error) {
      setStatusMessage('Error al configurar la red Sepolia.');
      console.error('Error al configurar la red Sepolia:', error);
    }
  };

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

   // Función para manejar la solicitud de tokens
   const handleRequestTokens = async () => {
    setLoadingMessage(true);
    setSuccessMessage(null);
    setStatusMessage('');

    try {
      const userWallet = await window.ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => accounts[0]);
      const { status, data } = await claimInitialsTokens(userWallet);

      console.log("MENSAJE ERROR: ", data.error);

      if (status === 200) {
        setSuccessMessage('Tokens enviados correctamente. ¡Disfruta de tus 100 UPC!');
        setTimeout(() => setSuccessMessage(''), 5000); // Mensaje visible durante 5 segundos
      } else if (status === 400 && data.error === 'Los tokens ya fueron reclamados por esta dirección') {
        setStatusMessage('Ya has reclamado tus tokens iniciales. Solo puedes hacerlo una vez.');
        setTimeout(() => setStatusMessage(''), 5000); // Mensaje visible durante 5 segundos
      } else {
        setStatusMessage('Hubo un error al solicitar los tokens. Intenta nuevamente.');
        setTimeout(() => setStatusMessage(''), 5000); // Mensaje visible durante 5 segundos
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Hubo un error al solicitar los tokens. Intenta nuevamente.');
      setTimeout(() => setStatusMessage(''), 5000); // Mensaje visible durante 5 segundos
    } finally {
      setLoadingMessage(false);
    }
  };

  return (
    <div className="content-container-NC">
      {/* Cabecera de página */}
      <header className="page-header">
        <h1 className="page-header-title">
          UPCoin
          <span className="separator">|</span>
          <span className="subtitle">Primeros pasos con UPCoin</span>
        </h1>
      </header>

      {/* Imagen de cabecera */}
      <div className="header-image-NC"></div>

      {/* Mensaje de bienvenida */}
      <div className="intro-text">
        <p className="intro-title-NC">Hola UPCoin: La Nueva Criptomoneda de la UPC</p>
        <p className="intro-description">
          UPCoin es una criptomoneda diseñada para transformar la forma en que la comunidad UPC interactúa económicamente. Rápida, segura y fácil de usar, UPCoin permite a estudiantes, profesores y personal de la universidad realizar pagos y transacciones de manera eficiente dentro del entorno académico. Únete a la revolución digital y empieza a disfrutar de los beneficios de UPCoin.
        </p>
      </div>

      {/* Pestañas */}
      <div className="tabs">
        <div
          className={`tab ${activeTab === 'configurar' ? 'active' : ''}`}
          onClick={() => setActiveTab('configurar')}
        >
          Configurar Wallet
        </div>
        <div
          className={`tab ${activeTab === 'otra' ? 'active' : ''}`}
          onClick={() => setActiveTab('otra')}
        >
          Reclama tus primeros UPCs
        </div>
      </div>

      {/* Contenido de las pestañas */}
      <div className="tab-content">
        {activeTab === 'configurar' && (
          <div className="configuracion-contenido">
            {/* Texto explicativo */}
            <p className="configuracion-texto">
              Para comenzar a utilizar UPCoin, necesitas configurar la red Sepolia en tu wallet de MetaMask y agregar el token UPC a tu lista de activos.
            </p>
            {/* Botón */}
            <button className="button-configure-network-page" onClick={switchToSepolia}>
              Configurar red y agregar UPCoin
            </button>
          </div>
        )}
        {activeTab === 'otra' && (
          <div className="otra-pestana">
            <p className="configuracion-texto">
              Para reclamar tus primeros UPCs, asegúrate de tener MetaMask configurado en la red Sepolia.
            </p>
            <button
              className="button-configure-network-page"
              onClick={handleRequestTokens}
              disabled={loadingMessage}
            >
              {loadingMessage ? 'Cargando...' : 'Reclama tus 100 UPC'}
            </button>
            {statusMessage && <p className="status-message">{statusMessage}</p>}
            {successMessage && <p className="status-message success">{successMessage}</p>}
          </div>
        )}
      </div>

      {/* Mensaje de estado */}
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
};

export default NetworkConfigurationPage;