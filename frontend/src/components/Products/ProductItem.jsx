import React, { useEffect, useState } from 'react';
import '../Styles/ProductItem.css';

const ProductItem = ({product, onAddToCarrito, showAddButton}) => {
    const {productName, price, imageURL} = product;
    const [amount, setAmount] = useState(product.quantity || 1);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        computePrice();
    });

    const increment = () => {
        setAmount(amount + 1);
    }

    const decrement = () => {
        if (amount > 1) setAmount(amount - 1);
    }

    const computePrice = () => {
        setTotalPrice(price*amount);
    }

    return(
        <div className='product-item'>
            <h3>{productName}</h3>
            <div className='line'>
                <div className='product-info'>
                    <p className='text'>Precio: {totalPrice.toFixed(2)}</p>
                    {!showAddButton && (<p className='text'>Cantidad: {amount}</p>)}
                    {showAddButton && (
                        <div className='button-container'>
                            <div className='quantity-buttons'>
                                <button onClick={decrement} disabled={amount === 1}>-</button>
                                <span className='text'>{amount}</span>
                                <button onClick={() => {increment(); computePrice()}}>+</button>
                            </div>
                            <button onClick={() => onAddToCarrito (product, amount)}>Añadir al Carrito</button>
                        </div>
                    )}
                </div>
                <img className='imagen' src={imageURL} alt='' />
            </div>
        </div>
        

    );
};

export default ProductItem;
