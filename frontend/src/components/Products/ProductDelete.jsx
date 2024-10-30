import React, {useEffect, useState} from 'react';
import { getAllProducts, deleteProduct } from '../../services/Product';
import '../Styles/ProductDelete.css';

const ProductDelete = () => {
    const [products, setProducts] = useState('');
    const [loading, setLoading] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    useEffect(() => {
        const getProducts = async () => {
            
            try {
                const resp = await getAllProducts();
                console.log(resp.data);
                if (resp.status === 200) {
                    setErrorMessage('');
                    console.log(resp.status  + ": " + resp.data);
    
                    setProducts(resp.data);
                }
            } catch (error) {
                if (!error.response) {
                    setErrorMessage('No se ha podido conectar con el backend');
                    setTimeout(() => {setErrorMessage('');}, 1000);
                }
                else if (error.response.status === 400) {
                    console.log(error.response.status + ": " + error.response.data);
                    setErrorMessage(error.response.status + ": " + error.response.data);
                    setTimeout(() => {setErrorMessage('');}, 1000);
                }
                
            } finally {
                setLoading(false);
            }
            /*
            try {
                const productsData = await getAllProducts();
                setProducts(productsData);
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setLoading(false);
            }*/
        };

        getProducts();

    }, []);

    const handleDelete = async (productName) => {
        try {
            const resp = await deleteProduct(productName);
            console.log(resp.data);
            if (resp.status === 200) {
                setErrorMessage('');
                console.log(resp.status  + ": " + resp.data);

                setProducts(products.filter(product => product.productName !== productName));
                setErrorMessage('');
            }
        } catch (error) {
            if (!error.response) {
                setErrorMessage('No se ha podido conectar con el backend');
                setTimeout(() => {setErrorMessage('');}, 1000);
            }
            else if (error.response.status === 400) {
                console.log(error.response.status + ": " + error.response.data);
                setErrorMessage(error.response.status + ": " + error.response.data);
                setTimeout(() => {setErrorMessage('');}, 1000);
            }
            
        }
    };

    if (loading) return <p>Cargando productos...</p>
    if (products.length === 0) {
        return <p className='white-txt'>No existe ningun producto</p>;
    }

    return (
        <div className='product-delete-container'>
            <div className='product-delete-form'>
                {errorMessage && <p className='error-message'>{errorMessage}</p>}
                <ul className='products-list'>
                    {products.map((product) => (
                        <li key={product.productName} className='product-item'>
                                <span>{product.productName}</span>
                                <span>{product.price.toFixed(2)} UPCoin</span>
                                <img className='imagen' src={product.imageURL} alt='' /><button onClick={() => handleDelete(product.productName)}>Borrar</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProductDelete;
