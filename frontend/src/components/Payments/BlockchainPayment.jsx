import React, {useState, useEffect} from 'react';
import { sendPayment } from '../../services/Payment';
import '../Styles/BlockchainPayment.css';

const DESTINATARIO_PAGO = 0x1234;//CAMBIAR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const BlockchainPayment = ({costeTotal, onClose, onCancelPayment}) => {
    const [account, setAccount] = useState('');

    const [loading , setLoading] = useState(false);
    const [errorMessage , setErrorMessage] = useState('');
    const [successMessage , setSuccessMessage] = useState('');

    const amount = costeTotal;
    const recipient = `${DESTINATARIO_PAGO}`;

    useEffect(() => {
        const checkMetaMaskConnection = async () => {
            if (typeof window.ethereum != 'undefined') {
                try {
                    const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
                    setAccount(accounts[0]);
                } catch (error) {
                    console.error("Error al conectarse a MetaMask", error);
                    setErrorMessage("Fallo al conectarse a MetaMask. Comprueba si esta instalado y desbloqueado");
                }
            } else {
                setErrorMessage("MetaMask no esta instalado. Intalalo para poder pagar.");
            }
        };

        checkMetaMaskConnection();
    }, []);

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
    

        try {
            if (!window.ethereum) throw new Error ("MetaMask no esta instalado");

            const message = `Pay ${amount} UPCoin to ${recipient}`;

            const signature = await window.ethereum.request({method: 'personal_sign', params: [message, account]});

            const paymentData = {
                signature,
                message,
                account,
                recipient,
                sender: account
            };

            try {
                const resp = await sendPayment(paymentData);
                console.log(resp.data);
                if (resp.status === 200) {
                    setErrorMessage('');
                    console.log(resp.status  + ": " + resp.data);
    
                    setSuccessMessage('Pago realizado');
                    setTimeout(() => {setSuccessMessage('');}, 1000);
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

        } catch (error) {
            console.error(error);
            setErrorMessage(error || 'Ha ocurrido un error durante el pago')
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='blockchain-payment'>
            <h2>Blockchain Payment</h2>
            {account ? (<p className='txt'>Cuenta conectada: {account}</p>) : (<p>Porfavor conecta tu cuenta de MetaMask wallet</p>)}
            <form onSubmit={handlePayment}>
                <div>
                    <p className='txt'>Total a pagar: {amount} UPCoin</p>
                    <p className='txt'>Destinatario del pago: {recipient}</p>
                </div>
                <button className='pay' type='submit' disabled={!account || loading}>
                    {loading ? 'Procesando...' : 'Firma el Pago'}
                </button>
                <button className='cancel' type="button" onClick={() => {onClose(); onCancelPayment();}}>Cancelar</button>
            </form>
            {errorMessage && <p className='errorMessage'>{errorMessage}</p>}
            {successMessage && <p className='successMessage'>{successMessage}</p>}
        </div>
    );
};

export default BlockchainPayment;