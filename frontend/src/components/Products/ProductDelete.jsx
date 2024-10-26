import React, {useEffect, useState} from 'react';
import { getAllProducts, deleteProduct } from '../../services/Product';
import '../Styles/ProductDelete.css';

const ProductDelete = () => {
    const [products, setProducts] = useState('');
    const [loading, setLoading] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    //const [successMessage, setSuccessMessage] = useState(''); ELIMINAR
    
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
            //setSuccessMessage("Producto borrado");
            setErrorMessage('');
            //setTimeout(() => {setSuccessMessage('');}, 1000);

        } catch (error) {
            console.error(error);
            setErrorMessage(error.message || "Error al borrar el producto");
            //setSuccessMessage('');
            setTimeout(() => {setErrorMessage('');}, 1000);
        }
    };

    if (loading) return <p>Cargando productos...</p>
    //if (errorMessage) return <p className='error-message'>{errorMessage}</p>
    if (products.length === 0) {
        return <p className='white-txt'>No existe ningun producto</p>;
    }

    return (
        <div className='product-delete-container'>
            <div className='product-delete-form'>
                {/*{successMessage && <p className='success-message'>{success-message}</p>}*/}
                {errorMessage && <p className='error-message'>{errorMessage}</p>}
                <ul className='products-list'>
                    {products.map((product) => (
                        <li key={product.productName} className='product-item'>
                                <span>{product.productName}</span>
                                <span>{product.price.toFixed(2)} UPCoin</span>
                                <img className='imagen' src={product.image} alt='' /><button onClick={() => handleDelete(product.productName)}>Borrar</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProductDelete;