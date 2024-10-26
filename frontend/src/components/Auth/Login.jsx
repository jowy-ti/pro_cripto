import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {login} from '../../services/Auth';
import '../Styles/Login.css';

const Login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const resp = await login(userName, password);
            console.log(resp.data);
            if (resp.status === 200) {
                setErrorMessage('');
                console.log(resp.status  + ": " + resp.data);

                navigate('/dashboard');
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
    };

    return (
    <div className='login-container'>
        <div className='login-form'>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Usuario:</label>
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required/>
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <button type="submit">Iniciar Sesión</button>
                {errorMessage && <p className='error-message' style={{color: 'red'}}>{errorMessage}</p>}
            </form>
        </div>
        
    </div>
    );
};

export default Login;