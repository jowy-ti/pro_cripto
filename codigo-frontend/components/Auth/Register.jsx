import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {register} from '../../services/Auth';
import '../Styles/Register.css';

const Register = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== passwordConfirmation) {
            setErrorMessage('Los dos passwords son diferentes');
            setSuccessMessage('');
            return;
        }

        try {

            //await register(userName, password);

            setSuccessMessage('Registro realizado correctamente');
            setErrorMessage('');

            navigate('/dashboard');
        } catch (error) {
            if (error.response) {
                setErrorMessage('Error al iniciar sesión');
            } else {
                setErrorMessage('No se ha podido conectar con el backend');
            }
            setSuccessMessage('');
        }
    };

    return (
        <div className='register-container'>
            <div className='register-form'>
                <h2>Registrarse</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='userName'>Usuario:</label>
                        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required/>
                    </div>
                    <div>
                        <label htmlFor='password'>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                    <div>
                        <label htmlFor='passwordConfirmation'>Password:</label>
                        <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required/>
                    </div>
                    {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
                    {successMessage && <p style={{color: 'green'}}>{successMessage}</p>}
                    <button type="submit">Iniciar Sesión</button>
                </form>
            </div>
        </div>
        );
};

export default Register;