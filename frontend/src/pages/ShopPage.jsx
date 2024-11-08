import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from '../components/Products/ProductList';
import ProductsCarrito from '../components/Products/ProductCarrito';
import '../components/Styles/ShopPage.css';

const ShopPage = () => {
    const navigate = useNavigate();
    const [itemsCarrito, setItemsCarrito] = useState([]);
    const [showOption, setShowOption] = useState(true);
    const [showButton, setShowButton] = useState(true);
    const [showContent, setShowContent] = useState(true);
    const [messageCarrito, setMessageCarrito] = useState('');

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
                </div>
            )}
        </div>
    );
};

export default ShopPage;