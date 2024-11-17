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
