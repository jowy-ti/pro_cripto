import React, {useState} from 'react';
import {register} from '../../services/Auth';
import '../Styles/Register.css';

const Register = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== passwordConfirmation) {
            setErrorMessage('Los dos passwords son diferentes');
            setSuccessMessage('');
            setTimeout(() => {setErrorMessage('');}, 1000);
            return;
        }

        try {

            const resp = await register(userName, password);

            if (resp.status === 200) {
                console.log(resp.status  + ": " + resp.data);
                setSuccessMessage(resp.status  + ": " + resp.data);
                setErrorMessage('');
                setTimeout(() => {setSuccessMessage('');}, 1000);
            }
        } catch (error) {
            setSuccessMessage('');

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
    };

    return (
        <div className='register-container'>
            <div className='register-form'>
                <h2>Registrar nuevo usuario</h2>
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
                        <label htmlFor='passwordConfirmation'>Confirma password:</label>
                        <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required/>
                    </div>
                    <button type="submit">Crear Usuario</button>
                    {errorMessage && <p className='error-message'>{errorMessage}</p>}
                    {successMessage && <p className='success-message'>{successMessage}</p>}
                </form>
            </div>
        </div>
        );
};

export default Register;