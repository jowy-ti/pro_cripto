import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from '../components/Products/ProductList';
import ProductsCarrito from '../components/Products/ProductCarrito';
import '../components/Styles/ShopPage.css';
import axios from 'axios';

const ShopPage = () => {
    const navigate = useNavigate();
    const [itemsCarrito, setItemsCarrito] = useState([]);
    const [showOption, setShowOption] = useState(true);
    const [showButton, setShowButton] = useState(true);
    const [showContent, setShowContent] = useState(true);
    const [messageCarrito, setMessageCarrito] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const requestTokens = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Obtener la dirección de la wallet del usuario desde MetaMask
            const userWallet = await window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(accounts => accounts[0]);

            // Realizar la solicitud al backend para obtener los 100 UPC
            const response = await axios.post('http://localhost:3001/request-initial-tokens', {
                userWallet,
                amount: 100,  // Solicitar 100 UPCoin
            });

            console.log(response.data);

            // Si la solicitud es exitosa, mostrar mensaje
            setSuccess('Tokens enviados correctamente');
        } catch (err) {
            console.error(err);
            setError('Hubo un error al enviar los tokens');
        } finally {
            setLoading(false);  // Finaliza el estado de carga
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

                    {/* Botón para solicitar los 100 UPCoin */}
                    <button
                        className="button-request-tokens"
                        onClick={requestTokens}
                        disabled={loading}
                    >
                        {loading ? 'Solicitando Tokens...' : 'Solicitar 100 UPCoin'}
                    </button>

                    {success && <div style={{ color: 'green' }}>{success}</div>}
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    
                    <button className="button-configure-network" onClick={navigateToNetworkConfig} >
                        Configurar UPCcoin
                    </button>
                </div>
            )}
        </div>
    );
};

export default ShopPage;