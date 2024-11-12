import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Register from '../components/Auth/Register';
import { isAuthenticated } from '../services/Auth';
import '../components/Styles/RegisterPage.css';

const RegisterPage = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const checkCookie = async() => {
            try {
                const {status, data} = await isAuthenticated('/register');
                console.log(`${status}: ${data}`);

                if (status === 200) {
                    console.log("Usuario autenticado");
                } else {
                    navigate({pathname: '/errorPage', search: `?error_msg=Error status: ${status}`});
                }

            } catch (error) {
                if (error.message.includes('Error HTTP:')) {
                    navigate({pathname: '/errorPage', search: `?error_msg=Permiso denegado`} );
                }
                else {
                    navigate({pathname: '/errorPage', search: "?error_msg=No hay conexion con el backend"});
                }
            }
        };

        checkCookie();
    }, [navigate]);

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