import React, {useState} from 'react';
import ProductList from '../components/Products/ProductList';
import ProductsCarrito from '../components/Products/ProductCarrito';
import '../components/Styles/ShopPage.css';

const ShopPage = () => {
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
    };

    const handlePayment = () => {
        setShowButton(false);
    }

    const handleCancelPayment = () => {
        setShowButton(true);
    }

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
                    <ProductsCarrito itemsCarrito={itemsCarrito} onRemoveFromCarrito={handleRemoveFromCarrito} onPayment={handlePayment} onCancelPayment={handleCancelPayment}/>
                    )}
                </div>
            )}
        </div>
    );
};

export default ShopPage;