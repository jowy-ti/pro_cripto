import React from 'react';
import Register from '../components/Auth/Register';
import '../components/Styles/LoginPage.css';

const RegisterPage = () => {
    return (
        <div className='page-container'>
            <h2>Registrar Usuario</h2>
            <Register />
        </div>
        
    );
};

export default RegisterPage;