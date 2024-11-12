import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { isAuthenticated } from '../services/Auth';
import '../components/Styles/ProductManagementPage.css';

const ProductManagementPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkCookie = async() => {
            try {
                const {status, data} = await isAuthenticated('/productmanagement');
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