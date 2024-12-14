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
                const {status, data} = await getAllProducts();
                console.log(data);
                if (status === 200) {
                    setErrorMessage('');
                    console.log(status  + ": " + data);
    
                    setProducts(data); //JSON.parse()
                } else {
                    setErrorMessage(`Error status: ${status}: ${data}`);
                    setTimeout(() => {setErrorMessage('');}, 1000);
                }
            }  catch (error) {
                setErrorMessage(`Error al conectar al backend: ${error.message}`);
                setTimeout(() => {setErrorMessage('');}, 1000);
                
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
            const {status, data} = await await deleteProduct(productName);
            console.log(data);
            if (status === 200) {
                console.log(status  + ": " + data);

                setProducts(products.filter(product => product.productName !== productName));
                setErrorMessage('');
            } else {
                setErrorMessage(`Error status: ${status}: ${data}`);
                setTimeout(() => {setErrorMessage('');}, 1000);
            }
        } catch (error) {
            setErrorMessage(`Error al conectar al backend: ${error.message}`);
            setTimeout(() => {setErrorMessage('');}, 1000);
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
                                <span>{product.price} UPCoin</span>
                                <img className='imagen' src={product.imageURL} alt='' /><button onClick={() => handleDelete(product.productName)}>Borrar</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProductDelete;
