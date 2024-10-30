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
                const resp = await isAuthenticated('/dashboard');
                console.log(resp.status + ": " + resp.data);
            } catch (error) {
                if (!error.response) {
                    navigate({pathname: '/errorPage', search: "?error_msg=No hay conexion con el backend"});
                }
                else if (error.response.status === 400) {
                    console.log(error.response.status + ": " + error.response.data);
                    navigate({pathname: '/errorPage', search: `?error_msg=${error.response.status}: ${error.response.data}`});
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

            const resp = await logout();

            if (resp.status === 200) {
                navigate('/login');
            }
        } catch (error) {
            if (!error.response) {
                setErrorMessage('No se ha podido conectar con el backend');
                setTimeout(() => {setErrorMessage('');}, 1000);
            }
            else if (error.response.status === 400) {
                console.log(error.response.status + ": " + error.response.data);
                setErrorMessage(error.response.status + ": " + error.response.data);
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