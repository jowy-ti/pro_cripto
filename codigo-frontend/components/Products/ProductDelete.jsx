import React, {useEffect, useState} from 'react';
import { getAllProducts, deleteProduct } from '../../services/Product';
import '../Styles/ProductDelete.css';

const ProductDelete = ({productsList, onProductDeleted}) => {
    const [products, setProducts] = useState(productsList);
    const [loading, setLoading] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const getProducts = async () => {
            try {
                const productsData = await getAllProducts();
                setProducts(productsData);
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, []);

    const handleDelete = async (productName) => {
        try {
            //await deleteProduct(productName);
            //onProductDeleted(productName);
            setProducts(products.filter(product => product.productName !== productName));
            setSuccessMessage("Producto borrado");
            setErrorMessage('');
            setTimeout(() => {setSuccessMessage('');}, 1000);
        } catch (error) {
            console.error(error);
            setErrorMessage(error.message || "Error al borrar el producto");
            setSuccessMessage('');
            setTimeout(() => {setErrorMessage('');}, 1000);
        }
    };

    if (loading) return <p>Cargando productos...</p>
    if (errorMessage) return <p className='errorMessage'>{errorMessage}</p>

    return (
        <div className='product-delete-container'>
            <div className='product-delete-form'>
                {successMessage && <p className='successMessage'>{successMessage}</p>}
                <ul className='products-list'>
                    {products.map((product) => (
                        <li key={product.productName} className='product-item'>
                            <div className='delete-container'>
                                <span className='product-info'> {product.productName} - {product.price.toFixed(2)} UPCoin</span>
                                <button onClick={() => handleDelete(product.productName)}>Borrar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProductDelete;