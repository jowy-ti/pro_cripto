import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { requestInitialTokens } from '../services/TransferTokens'; // Ajusta la ruta si es necesario
import '../components/Styles/Dashboard.css';

const ClientMenuPage = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [loadingMessage, setLoadingMessage] = useState(false); // Estado para controlar la carga
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    const handleBuy = () => {
        navigate('/shoppage');
    };

    const handleConfigureNetwork = () => {
        navigate('/network-configuration');
    };

    const handleRequestTokens= async () => {
        setLoadingMessage(true);
        setErrorMessage(null);
        setSuccessMessage(null);
    
        try {
            // Obtener la dirección de la wallet del usuario desde MetaMask
            const userWallet = await window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(accounts => accounts[0]);
    
            // Llamar a la función para solicitar los tokens
            const { status, data } = await requestInitialTokens(userWallet);
    
            if (status === 200) {
            console.log(data);
            setSuccessMessage('Tokens enviados correctamente');
            setTimeout(() => {setSuccessMessage('');}, 1000);
            } else {
            setErrorMessage('Hubo un error al solicitar los tokens');
            setTimeout(() => {setErrorMessage('');}, 1000);
            }
        } catch (err) {
            console.error(err);
            setErrorMessage('Hubo un error al solicitar los tokens');
            setTimeout(() => {setErrorMessage('');}, 1000);
        } finally {
            setLoadingMessage(false);
        }
    }
    
    return(
        <div className='dashboard-container'>
            <div className='dashboard-content'>
                <h2>Menú</h2>
                <button onClick={handleBuy}>Comprar</button>
                <button onClick={handleConfigureNetwork}>Configurar red</button>
                <button onClick={handleRequestTokens}>100 UPCoins</button>
                {errorMessage && <p className='error-message'>{errorMessage}</p>}
                {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
                {loadingMessage && <div style={{ color: 'green' }}>{'Solicitando Tokens...'} </div>}
            </div>
            
        </div>
    );
};

export default ClientMenuPage;