import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/Auth';
import ProductDelete from '../components/Products/ProductDelete';
import '../components/Styles/DeleteProductPage.css';

const DeleteProductPage = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const checkCookie = async() => {
            try {
                const {status, data} = await isAuthenticated('/deleteproduct');
                console.log(`${status}: ${data}`);

                if (status === 200) {
                    console.log("Usuario autenticado");
                } else {
                    navigate({pathname: '/errorPage', search: `?error_msg=Error status: ${status}, Data: ${data}`});
                }

            } catch (error) {
                navigate({pathname: '/errorPage', search: `?error_msg=Error al conectar al backend: ${error.message}`});
            }
        };

        checkCookie();
    }, [navigate]);

    const handleBack = () => {
        navigate('/productmanagement');
    }

    return (
        <div className='page-container'>
            <button className='back' onClick={handleBack}>Atras</button>
            <h2>Eliminar Productos</h2>
            <ProductDelete />
        </div>
    );
};

export default DeleteProductPage;