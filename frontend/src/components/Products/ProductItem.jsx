import React, { useEffect, useState } from 'react';
import '../Styles/ProductItem.css';

const ProductItem = ({product, onAddToCarrito, showAddButton}) => {
    const {productName, price, imageURL} = product;
    const [amount, setAmount] = useState(product.quantity || 1);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        computePrice();
    }, [amount, price]); // Recalcular el precio cada vez que cambie la cantidad

    const increment = () => {
        setAmount(amount + 1);
    }

    const decrement = () => {
        if (amount > 1) setAmount(amount - 1);
    }

    const computePrice = () => {
        setTotalPrice(price * amount);
    }

    return(
        <div className='product-item'>
            <h3>{productName}</h3>
            {/* Contenedor para la imagen */}
            <div className="product-image-container">
                <img className="imagen" src={imageURL} alt={productName} />
            </div>
            
            <div className='product-info'>
                <p className='text'>Precio: {totalPrice.toFixed(2)} UPC</p>
                
                {!showAddButton && (<p className='text'>Cantidad: {amount}</p>)}

                {showAddButton && (
                    <div className='quantity-row'>
                        <div className='quantity-buttons'>
                            <button onClick={decrement} disabled={amount === 1}>-</button>
                            <span className='text'>{amount}</span>
                            <button onClick={increment}>+</button>
                        </div>
                    </div>
                )}
            </div>

            {showAddButton && (
                <div className='add-to-cart-row'>
                    <button className='add-to-cart' onClick={() => onAddToCarrito(product, amount)}>Añadir al Carrito</button>
                </div>
            )}
        </div>
    );
};

export default ProductItem;
