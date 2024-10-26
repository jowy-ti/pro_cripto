import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { isAuthenticated } from '../services/Auth';
import '../components/Styles/ProductManagementPage.css';

const ProductManagementPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkCookie = async() => {
            try {
                const resp = await isAuthenticated('/productmanagementpage');
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

    const handleAdd = () => {
        navigate('/addproduct');
    };

    const handleDelete = () => {
        navigate('/deleteproduct');
    };

    const handleModify = () => {
        navigate('/modifyproduct');
    }
    const handleBack = () => {
        navigate('/dashboard');
    }

    return (
        <div className='product-management-page'>
            <button className='back' onClick={handleBack}>Atras</button>
            <h1>Gestionar Productos</h1>
            <div className='product-management-content'>
                <h2>Opciones</h2>
                <button onClick={handleAdd}>Añadir Producto</button>
                <button onClick={handleDelete}>Eliminar Producto</button>
                <button onClick={handleModify}>Modificar Producto</button>
            </div>       
        </div>
    );
};

export default ProductManagementPage;