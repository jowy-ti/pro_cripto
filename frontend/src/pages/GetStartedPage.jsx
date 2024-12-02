import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { claimInitialsTokens } from '../services/ClaimTokens';
import '../components/Styles/GetStartedPage.css';

const GetStartedPage = () => {
  const [statusMessage, setStatusMessage] = useState('');
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [activeTab, setActiveTab] = useState('configurar'); // Pestaña activa
  const navigate = useNavigate(); // Crea el hook para navegar


  const switchToSepolia = async () => {
    if (!window.ethereum) {
      setStatusMessage('MetaMask no está instalado.');
      setTimeout(() => setStatusMessage(''), 3000);
      console.log('MetaMask no está instalado');
      return;
    }

    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log('ID de la cadena actual:', currentChainId);

    const sepoliaChainId = '0xaa36a7';

    if (currentChainId === sepoliaChainId) {
      setStatusMessage('Conectado a la red Sepolia.');
      setTimeout(() => setStatusMessage(''), 3000);
      console.log('Ya estás en la red Sepolia');
      addUpcoinToken();
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: sepoliaChainId }],
      });

      setStatusMessage('Red Sepolia configurada correctamente.');
      console.log('Red Sepolia configurada correctamente');
      addUpcoinToken();
    } catch (error) {
      setStatusMessage('Error al configurar la red Sepolia.');
      console.error('Error al configurar la red Sepolia:', error);
    }
  };

  const addUpcoinToken = async () => {
    const upcoinToken = {
      type: 'ERC20',
      options: {
        address: process.env.REACT_APP_UPCOIN_DEPLOY_ADDRESS, // Dirección del contrato de UPCoin
        symbol: 'UPC',
        decimals: 2,
      },
    };

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

  const handleRequestTokens = async () => {
    setLoadingMessage(true);
    setStatusMessage('');

    try {
      const userWallet = await window.ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => accounts[0]);
      const { status, data } = await claimInitialsTokens(userWallet);

      if (status === 200) {
        setStatusMessage('Tokens enviados correctamente. ¡Disfruta de tus 100 UPC!');
        setTimeout(() => setStatusMessage(''), 3000);
      } else if (status === 400 && data.error === 'Los tokens ya fueron reclamados por esta dirección') {
        setStatusMessage('Ya has reclamado tus tokens iniciales. Solo puedes hacerlo una vez.');
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        setStatusMessage('Hubo un error al solicitar los tokens. Intenta nuevamente.');
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Hubo un error al solicitar los tokens. Intenta nuevamente.');
      setTimeout(() => setStatusMessage(''), 3000);
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
      <div className="header-image-NC">
        {/* Mensaje de bienvenida */}
        <div className="intro-text">
          <p className="intro-title-NC">Hola UPCoin</p>
          <p className="intro-subtitle">La Nueva Criptomoneda de la UPC</p>
          <p className="intro-description">
            UPCoin es una criptomoneda basada en el estándar ERC20, diseñada para transformar la economía de la UPC. 
            Con un contrato inteligente desplegado en la testnet de Sepolia, UPCoin permite a estudiantes, profesores 
            y personal realizar pagos y transacciones de forma rápida, segura y eficiente dentro del entorno académico. 
            Únete a la revolución digital y empieza a disfrutar de los beneficios de UPCoin.
          </p>
        </div>
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
            <p className="configuracion-texto">
              Para comenzar a utilizar UPCoin, se va ha configurar la red Sepolia en tu wallet de MetaMask y agregar el token UPC a tu lista de activos.
            </p>
            <button className="button-configure-network-page" onClick={switchToSepolia}>
              Configurar red y agregar UPCoin
            </button>
          </div>
        )}
        {activeTab === 'otra' && (
          <div className="otra-pestana">
            <p className="configuracion-texto">
              Para reclamar tus primeros UPCs, asegúrate de tener MetaMask configurado en la red Sepolia. Los usuarios solo pueden reclamar 100 UPC una vez por wallet.
            </p>
            <button
              className="button-configure-network-page"
              onClick={handleRequestTokens}
              disabled={loadingMessage}
            >
              {loadingMessage ? 'Cargando...' : 'Reclama tus 100 UPC'}
            </button>
          </div>
        )}
      </div>

      {/* Mensaje de estado */}
      {statusMessage && (
        <p className={`status-message 
          ${statusMessage === 'MetaMask no está instalado.' ? 'error' : ''}
          ${statusMessage.includes('Error') ? 'error' : ''} 
          ${statusMessage.includes('error') ? 'error' : ''} 
          ${statusMessage.includes('error') ? 'error' : ''} 
          ${statusMessage === 'Ya has reclamado tus tokens iniciales. Solo puedes hacerlo una vez.' ? 'error' : ''}
          ${statusMessage.includes('correctamente') ? 'success' : ''}`}
        >
          {statusMessage}
        </p>
      )}

      {/* Botón para redirigir a ShopPage */}
      <div className="button-container">
        <button className="button-go-to-shop" onClick={() => navigate('/shoppage')}>
          Ir a la tienda
        </button>
      </div>
    </div>
  );
};

export default GetStartedPage;