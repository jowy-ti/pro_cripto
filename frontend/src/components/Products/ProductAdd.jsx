import React, {useState} from 'react';
import { addProduct } from '../../services/Product';
import '../Styles/ProductAdd.css';

const ProductAdd = () => {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!productName|!price|!image) {
                throw new Error("Rellena los campos vacios");
            }

            const newProduct = {
                productName,
                price: parseFloat(price),
                image,
            }

            //await addProduct(newProduct);

            setSuccessMessage("Producto añadido correctamente");
            setErrorMessage("");

            setProductName('');
            setPrice('');
            setImage('');
            setTimeout(() => {setSuccessMessage('');}, 1000);
        } catch (error) {
            setErrorMessage(error.message || 'Error al añadir el producto');
            setSuccessMessage('');
            setTimeout(() => {setErrorMessage('');}, 1000);
        }
    };

    return (
        <div className='product-add-container'>
            <div className='product-add-form'>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='productName'>Nombre del Producto:</label>
                        <input type='text' id='productName' value={productName} onChange={(e) => setProductName(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor='price'>Precio:</label>
                        <input type='number' id='price' value={price} onChange={(e) => setPrice(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor='image'>URL Imagen:</label>
                        <input type='text' id='image' value={image} onChange={(e) => setImage(e.target.value)} required />
                    </div>
                    <button type='submit'>Añadir Producto</button>
                </form>
                {errorMessage && <p className='errorMessage'>{errorMessage}</p>}
                {successMessage && <p className='successMessage'>{successMessage}</p>}
            </div>
            
        </div>
    );
};

export default ProductAdd;