import React, {useEffect, useState} from 'react';
import ProductAdd from '../components/Products/ProductAdd';
import ProductDelete from '../components/Products/ProductDelete';
import { getAllProducts } from '../services/Product';
import '../components/Styles/ProductManagementPage.css';

const ProductManagementPage = () => {
    const [products, setProducts] = useState([]);

    const [showOption, setShowOption] = useState(false);
    
    const handleShow = () => {
        setShowOption(!showOption);
    }
    
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const productData = await getAllProducts();
                setProducts(productData);
            } catch (error) {
                console.error("Error al cargar los productos de la pagina:", error);
            }
        };
        loadProducts();
    }, []);

    const handleProductAdded = (newProduct) => {
        setProducts([...products, newProduct]);
    };

    const handleProductDeleted = (productName) => {
        setProducts(products.filter(product => product.productName !== productName));
    };

    return (
        <div className='product-management-page'>
            <h1>Gestionar Productos</h1>
            {showOption && (
            <section className='product-add-section'>
                <h2>Añadir producto</h2> 
                <ProductAdd onProductAdded={handleProductAdded}/>
            </section>
            )}
            {!showOption && (
            <section className='product-delete-section'>
                <h2>Eliminar producto</h2> 
                <ProductDelete productsList={products} onProductAdded={handleProductDeleted}/>
            </section>
            )}
            <div className='line'>
                <button className='management-button' onClick={handleShow}>{showOption ? 'Eliminar Producto' : 'Añadir Producto'}</button>
            </div>
            
        </div>
    );
};

export default ProductManagementPage;