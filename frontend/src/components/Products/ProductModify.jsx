import React, { useState, useEffect } from 'react';
import { getAllProducts, updateProduct } from '../../services/Product';
import '../Styles/ProductModify.css';

const ProductModify = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modifiedProduct, setModifiedProduct] = useState({productName: '', price: '', image: ''});

    useEffect(() => {
        getProducts();

    }, []);

    const getProducts = async () => {
        /* LLAMADA CORRECTA
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
            
        }
        */
        try {
            const productsData = await getAllProducts();
            setProducts(productsData);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleModify = (product) => {
        setSelectedProduct(product);
        setModifiedProduct({
            productName: product.productName,
            price: product.price,
            image: product.image
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
            
        try {
            const resp = await updateProduct(selectedProduct.productName, modifiedProduct);
            console.log(resp.data);
            if (resp.status === 200) {
                setErrorMessage('');
                console.log(resp.status  + ": " + resp.data);
                await getProducts();
                setSelectedProduct(null);
                setModifiedProduct({ productName: '', price: '', image: '' });
                setSuccessMessage('Producto modificado correctamente');
                setTimeout(() => {setSuccessMessage('');}, 1000);
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

    if (loading) return <p>Cargando productos...</p>;

    return (
        <div className="modify-product-container">

            <div className='list-of-products'>
                {!selectedProduct && (
                    <ul className="products-list">
                        {products.map((product) => (
                            <li key={product.productName} className="product-item">
                                <span>{product.productName}</span>
                                <span>{product.price.toFixed(2)} UPCoin</span>
                                <img className='imagen' src={product.image} alt='' />
                                <button onClick={() => handleModify(product)}>Modificar</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            

            {selectedProduct && (
                <form onSubmit={handleSubmit} className="modify-form">
                    <h3>Modificar: {selectedProduct.productName}</h3>
                    <div>
                        <label htmlFor="productName">Nombre del Producto:</label>
                        <input type="text" id="productName" value={modifiedProduct.productName} onChange={(e) => setModifiedProduct({productName: e.target.value})}/>
                    </div>
                    <div>
                        <label htmlFor="price">Precio:</label>
                        <input type="number" id="price" value={modifiedProduct.price} onChange={(e) => setModifiedProduct({price: e.target.value})}/>
                    </div>
                    <div>
                        <label htmlFor="image">URL de la Imagen:</label>
                        <input type="text" id="image" value={modifiedProduct.image}onChange={(e) => setModifiedProduct({image: e.target.value})}/>
                    </div>
                    <button type="submit">Guardar Cambios</button>
                    <button type="button" onClick={() => setSelectedProduct(null)}>Cancelar</button>
                    {errorMessage && <p className='error-message'>{errorMessage}</p>}
                    {successMessage && <p className='success-message'>{successMessage}</p>}
                </form>
            )}
        </div>
    );
};

export default ProductModify;
