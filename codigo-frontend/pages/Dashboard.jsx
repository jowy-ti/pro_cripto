import React from 'react';
import {useNavigate} from 'react-router-dom';
import { logout } from '../services/Auth';
import '../components/Styles/Dashboard.css';

const Dashboard = () => {
    
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const handleManageProductClick = () => {
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
                <button onClick={handleRegisterClick}>Registrar Usuario</button>
                <button onClick={handleManageProductClick}>Gestionar Productos</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
            
        </div>
    );
};

export default Dashboard;