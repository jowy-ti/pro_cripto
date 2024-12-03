import React, { useState } from 'react';
import ProductItem from './ProductItem';
import BlockchainPayment from '../Payments/BlockchainPayment';
import '../Styles/ProductCarrito.css';

const ProductCarrito = ({ itemsCarrito, onRemoveFromCarrito, onPayment, onCancelPayment, onEmptyCarrito }) => {
    const [isPaymentVisible, setIsPaymentVisible] = useState(false);

    if (itemsCarrito.length === 0) {
        return <p>El carrito esta vacio</p>;
    }

    const totalAmount = itemsCarrito.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2);

    const handlePayment = () => {
        setIsPaymentVisible(true);
    };

    const handleEmptyCarrito = () => {
        onEmptyCarrito();
    };

    return (
        <div className='products-carrito'>
            {!isPaymentVisible && (
                <div>
                    <h2>Tu carrito</h2>
                    <div className='items-carrito'>
                        {itemsCarrito.map((product) => (
                            <div key={product.productName} className='item'>
                                <ProductItem product={product} showAddButton={false} />
                                <div className="remove-button-container">
                                    <button onClick={() => onRemoveFromCarrito(product.productName)}>Eliminar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <h3>Importe total: {totalAmount} UPC</h3>
                    <div className='opciones-carrito'>
                        <button className='pay-button' onClick={() => { handlePayment(); onPayment(); }}>Pagar</button>
                        <button className='empty-button' onClick={() => handleEmptyCarrito()}>Vaciar Carrito</button>
                    </div>
                </div>
            )}
            {isPaymentVisible && (
                <BlockchainPayment costeTotal={totalAmount} onClose={() => setIsPaymentVisible(false)} onCancelPayment={onCancelPayment} />
            )}
        </div>
    );
};

export default ProductCarrito;