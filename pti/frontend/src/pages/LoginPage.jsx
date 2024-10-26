import React from 'react';
import Login from '../components/Auth/Login';
import '../components/Styles/LoginPage.css';

const LoginPage = () => {
    return (
        <div className='page-container'>
                <h2>Pagina de Login</h2>
                <Login />
        </div>
    );
};

export default LoginPage;