import React from 'react';
import {useNavigate} from 'react-router-dom';
import '../components/Styles/ProductManagementPage.css';

const ProductManagementPage = () => {
    const navigate = useNavigate();

    const handleAdd = () => {
        navigate('/addproduct');
    };

    const handleDelete = () => {
        navigate('/deleteproduct');
    };

    const handleModify = () => {
        navigate('/modifyproduct');
    }
    const handleBack = () => {
        navigate('/dashboard');
    }

    return (
        <div className='product-management-page'>
            <button className='back' onClick={handleBack}>Atras</button>
            <h1>Gestionar Productos</h1>
            <div className='product-management-content'>
                <h2>Opciones</h2>
                <button onClick={handleAdd}>Añadir Producto</button>
                <button onClick={handleDelete}>Eliminar Producto</button>
                <button onClick={handleModify}>Modificar Producto</button>
            </div>       
        </div>
    );
};

export default ProductManagementPage;