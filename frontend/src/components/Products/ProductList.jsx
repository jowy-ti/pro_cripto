import React, {useState, useEffect} from 'react';
import ProductItem from './ProductItem';
import { getAllProducts } from '../../services/Product';
import '../Styles/ProductList.css';

const ProductList = ({onAddToCarrito, itemsCarrito}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
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
        
        getProducts();

    }, []);

    if (loading) return <p>Cargando Productos ...</p>;
    if (errorMessage) return <p>{errorMessage}</p>

    return(
        <div className="product-list">
            <h2>Productos</h2>
            <div className="products">
                {products.map((product) => {
                    const itemInCarrito = itemsCarrito.find(item => item.productName === product.productName);
                    const quantityInCarrito = itemInCarrito ? itemInCarrito.quantity : 0;
                    return (
                        <ProductItem key={product.productName} product={{...product, quantity: quantityInCarrito}} onAddToCarrito={onAddToCarrito} showAddButton={true}/>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductList;