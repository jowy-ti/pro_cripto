import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductAdd from '../components/Products/ProductAdd';
import '../components/Styles/AddProductPage.css';

const AddProductPage = () => {

    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/productmanagement');
    }

    return (
        <div className='page-container'>
            <button className='back' onClick={handleBack}>Atras</button>
            <h2>Añadir Productos</h2>
            <ProductAdd />
        </div>
    );
};

export default AddProductPage;