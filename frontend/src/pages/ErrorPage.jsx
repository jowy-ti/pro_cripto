import React from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import '../components/Styles/ErrorPage.css';

const ErrorPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const error_msg = searchParams.get('error_msg');

    const handleLogin = () => {
        navigate('/login');
    }

    return (
        <div className='error-page'>
            <h1>{error_msg}</h1>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default ErrorPage;