import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/Auth';
import ProductModify from '../components/Products/ProductModify';
import '../components/Styles/ModifyProductPage.css';

const ModifyProductPage = () => {

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

    const handleBack = () => {
        navigate('/productmanagement');
    }

    return (
        <div className='page-container'>
            <button className='back' onClick={handleBack}>Atras</button>
            <h2>Modificar Productos</h2>
            <ProductModify />
        </div>
    );
};

export default ModifyProductPage;