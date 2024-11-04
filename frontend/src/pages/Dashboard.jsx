import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { isAuthenticated, logout } from '../services/Auth';
import '../components/Styles/Dashboard.css';

const Dashboard = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkCookie = async() => {
            try {
                const {status, data} = await isAuthenticated('/dashboard');
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

    const handleRegister = () => {
        navigate('/register');
    };

    const handleManageProduct = () => {
        navigate('/productmanagement');
    };

    const handleLogout = async () => {
        
        try {

            const { status, data } = await logout();
            console.log(data);
            if (status === 200) {
                navigate('/login');
            } else {
                setErrorMessage(`Error status: ${status}`);
                setTimeout(() => {setErrorMessage('');}, 1000);
            }
        } catch (error) {
            if (error.message.includes('Error HTTP:')) {
                setErrorMessage(`Error al cerrar la sesion`);
                setTimeout(() => {setErrorMessage('');}, 1000);
            }
            else {
                setErrorMessage('No se ha podido conectar con el backend');
                setTimeout(() => {setErrorMessage('');}, 1000);
            }
        }
        
    }
    
    return(
        <div className='dashboard-container'>
            <div className='dashboard-content'>
                <h2>Dashboard</h2>
                <button onClick={handleRegister}>Registrar Usuario</button>
                <button onClick={handleManageProduct}>Gestionar Productos</button>
                <button onClick={handleLogout}>Logout</button>
                {errorMessage && <p className='error-message'>{errorMessage}</p>}
            </div>
            
        </div>
    );
};

export default Dashboard;