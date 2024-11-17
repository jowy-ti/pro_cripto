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
            const {status, data} = await login(userName, password);
            console.log(data);
            if (status === 200) {
                setErrorMessage('');
                console.log(status  + ": " + JSON.stringify(data));

                navigate('/dashboard');
            } else {
                setErrorMessage(`Error status: ${status}: ${data}`);
                setTimeout(() => {setErrorMessage('');}, 1000);
            }
        } catch (error) {
            setErrorMessage(`Error al conectar al backend: ${error.message}`);
            setTimeout(() => {setErrorMessage('');}, 1000);
            
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