import React from 'react';
import { useNavigate } from 'react-router-dom';
import Register from '../components/Auth/Register';
import '../components/Styles/RegisterPage.css';

const RegisterPage = () => {

    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/dashboard');
    }

    return (
        <div className='page-container'>
            <button className='back' onClick={handleBack}>Atras</button>
            <h2>Registrar Usuario</h2>
            <Register />
        </div>
        
    );
};

export default RegisterPage;