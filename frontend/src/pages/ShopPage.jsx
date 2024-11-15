import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from '../components/Products/ProductList';
import ProductsCarrito from '../components/Products/ProductCarrito';
import '../components/Styles/ShopPage.css';
import { requestInitialTokens } from '../services/TransferTokens'; // Ajusta la ruta si es necesario

const ShopPage = () => {
    const navigate = useNavigate();
    const [itemsCarrito, setItemsCarrito] = useState([]);
    const [showOption, setShowOption] = useState(true);
    const [showButton, setShowButton] = useState(true);
    const [showContent, setShowContent] = useState(true);
    const [messageCarrito, setMessageCarrito] = useState('');
    const [loading, setLoading] = useState(false); // Estado para controlar la carga
    const [error, setError] = useState(null); // Estado para mensajes de error
    const [success, setSuccess] = useState(null);

    const requestTokens = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
    
        try {
          // Obtener la dirección de la wallet del usuario desde MetaMask
          const userWallet = await window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(accounts => accounts[0]);
    
          // Llamar a la función para solicitar los tokens
          const { status, data } = await requestInitialTokens(userWallet);
    
          if (status === 200) {
            console.log(data);
            setSuccess('Tokens enviados correctamente');
          } else {
            setError('Hubo un error al solicitar los tokens');
          }
        } catch (err) {
          console.error(err);
          setError('Hubo un error al solicitar los tokens');
        } finally {
          setLoading(false);
        }
      };

    const handleShow = () => {
        setShowOption(!showOption);
    }
    

    const handleAddToCarrito = (product, quantity) => {
        const existingProductIndex = itemsCarrito.findIndex(item => item.productName === product.productName);
        if (existingProductIndex !== -1) {
            [...itemsCarrito][existingProductIndex].quantity = quantity;
        } else {
            product.quantity = quantity;
        setItemsCarrito([...itemsCarrito, product]);
        }
        setMessageCarrito(`Producto: ${product.productName} añadido`);
        setShowContent(false);
        setTimeout(() => {setMessageCarrito(''); setShowContent(true);}, 1000);
        
    };

    const handleRemoveFromCarrito = (productName) => {
        setItemsCarrito(itemsCarrito.filter(product => product.productName !== productName));
        setShowContent(true);
    };

    const handleEmptyCarrito = () => {
        setItemsCarrito([]);
        /*setMessageCarrito('Carrito vaciado');
        setTimeout(() => {setMessageCarrito(''); setShowContent(true);}, 1000);*/
    }

    const handlePayment = () => {
        setShowButton(false);
    };

    const handleCancelPayment = () => {
        setShowButton(true);
    };

    const navigateToNetworkConfig = () => {
        navigate('/network-configuration');
    };

    return(
        <div className='content-container'>
            {messageCarrito && <div className='notification'>{messageCarrito}</div>}
            {showContent && (
                <div>
                    {showButton && (
                    <button className='button-top-right' onClick={handleShow}>{showOption ? 'Ver Carrito' : 'Ver Productos'}</button>
                    )}
                    {showOption && (
                    <ProductList onAddToCarrito={handleAddToCarrito}  itemsCarrito={itemsCarrito}/>
                    )}
                    {!showOption && (
                    <ProductsCarrito itemsCarrito={itemsCarrito} onRemoveFromCarrito={handleRemoveFromCarrito} 
                    onPayment={handlePayment} onCancelPayment={handleCancelPayment} onEmptyCarrito={handleEmptyCarrito}/>
                    )}

                    <button className="button-configure-network" onClick={navigateToNetworkConfig} >
                        Configurar UPCcoin
                    </button>

                    <button
                    className="button-request-tokens"
                    onClick={requestTokens}
                    disabled={loading}
                >
                    {loading ? 'Solicitando Tokens...' : 'Solicitar 100 UPCoin'}
                    </button>

                    {/* Mostrar mensajes de éxito o error */}
                    {success && <div style={{ color: 'green' }}>{success}</div>}
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                </div>
            )}
        </div>
    );
};

export default ShopPage;