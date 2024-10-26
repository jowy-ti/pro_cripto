import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductModify from '../components/Products/ProductModify';
import '../components/Styles/ModifyProductPage.css';

const ModifyProductPage = () => {

    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/productmanagement');
    }

    return (
        <div className='page-container'>
            <button className='back' onClick={handleBack}>Atras</button>
            <h2>Modificar Productos</h2>
            <ProductModify />
        </div>
    );
};

export default ModifyProductPage;