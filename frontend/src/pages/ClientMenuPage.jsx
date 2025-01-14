
import {useNavigate} from 'react-router-dom';
import '../components/Styles/ClientMenu.css';

const ClientMenuPage = () => {
    //const [errorMessage, setErrorMessage] = useState('');
    //const [loadingMessage, setLoadingMessage] = useState(false); // Estado para controlar la carga
    //const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    const handleBuy = () => {
        navigate('/shoppage');
    };

    const handleConfigureNetwork = () => {
        navigate('/network-configuration');
    };

    const handleClaimTokens = () => {
        navigate('/claim-tokens');
    };

    const handleTransferTokens = () => {
        navigate('/transfer-tokens'); 
    };

    const handleLoginForManagement = () => {
        navigate('/login'); 
    };

    return(
        <div className='ClientMenu-container'>
            <div className='ClientMenu-content'>
                <h2>Menú</h2>
                <button onClick={handleBuy}>Comprar</button>
                <button onClick={handleConfigureNetwork}>Empezar a utilizar UPCoin</button>
                <button onClick={handleClaimTokens}>Reclamar 100 UPCoins</button>
                <button onClick={handleTransferTokens}>Transferir Tokens</button>
                <button onClick={handleLoginForManagement}>Management</button>
                {/*{errorMessage && <p className='error-message'>{errorMessage}</p>}
                {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
                {loadingMessage && <div style={{ color: 'green' }}>{'Solicitando Tokens...'} </div>}*/}
            </div>
        </div>
    );
};

export default ClientMenuPage;