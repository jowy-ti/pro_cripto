import React, {useState, useEffect} from 'react';
import { sendPayment } from '../../services/Payment';
import '../Styles/BlockchainPayment.css';

const DESTINATARIO_PAGO = "0x2b41659B028269Fe71E6683c7240294cdD9607e1"; // Es una wallet mía (Sebas)

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
        console.log("Iniciando el proceso de pago...");
    

        try {
            if (!window.ethereum) throw new Error ("MetaMask no esta instalado");

            // Crear el mensaje a firmar según el formato del contrato
            const messageHash = `0x${web3.utils.soliditySha3(
                { t: 'address', v: account },
                { t: 'address', v: recipient },
                { t: 'uint256', v: amount * (10 ** 2) }
            ).toString('hex')}`;

            // Firma el mensaje con MetaMask
            const signature = await window.ethereum.request({ method: 'personal_sign', params: [messageHash, account] });

            const paymentData = {
                signature,
                from: account,
                to: recipient,
                amount: amount * (10 ** 2)
            };

            try {
                const {status, data} = await sendPayment(paymentData);
                console.log(data);
                if (status === 200) {
                    setErrorMessage('');
                    console.log(status  + ": " + data);
    
                    setSuccessMessage('Pago realizado');
                    setTimeout(() => {setSuccessMessage('');}, 1000);
                } else {
                    setErrorMessage(`Error status: ${status}`);
                    setTimeout(() => {setErrorMessage('');}, 1000);
                }
            } catch (error) {
                if (error.message.includes('Error HTTP:')) {
                    setErrorMessage(`Error al autenticarse: ${error.message}`);
                    setTimeout(() => {setErrorMessage('');}, 1000);
                }
                else {
                    setErrorMessage('No se ha podido conectar con el backend');
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
