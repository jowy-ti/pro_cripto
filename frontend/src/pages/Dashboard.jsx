import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { isAuthenticated, logout } from '../services/Auth';
import '../components/Styles/Dashboard.css';

const Dashboard = () => {
    
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

    const handleLogout = () => {
        logout();
        navigate('/login');
    }
    
    return(
        <div className='dashboard-container'>
            <div className='dashboard-content'>
                <h2>Dashboard</h2>
                <button onClick={handleRegister}>Registrar Usuario</button>
                <button onClick={handleManageProduct}>Gestionar Productos</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
            
        </div>
    );
};

export default Dashboard;