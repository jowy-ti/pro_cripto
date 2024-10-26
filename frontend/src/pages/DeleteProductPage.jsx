import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductDelete from '../components/Products/ProductDelete';
import '../components/Styles/DeleteProductPage.css';

const DeleteProductPage = () => {

    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/productmanagement');
    }

    return (
        <div className='page-container'>
            <button className='back' onClick={handleBack}>Atras</button>
            <h2>Eliminar Productos</h2>
            <ProductDelete />
        </div>
    );
};

export default DeleteProductPage;