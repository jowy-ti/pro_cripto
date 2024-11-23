import React, {useState, useEffect} from 'react';
import { sendPayment } from '../../services/Payment';
import '../Styles/BlockchainPayment.css';
import Web3 from 'web3';

const DESTINATARIO_PAGO = "0x2b41659B028269Fe71E6683c7240294cdD9607e1"; // Es una wallet mía (Sebas)

const BlockchainPayment = ({costeTotal, onClose, onCancelPayment}) => {
    const [account, setAccount] = useState('');

    const [loading , setLoading] = useState(false);
    const [errorMessage , setErrorMessage] = useState('');
    const [successMessage , setSuccessMessage] = useState('');

    const amount = costeTotal * Math.pow(10, 2);
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
            console.log("Meta maks Instalado");

            const web3 = new Web3(window.ethereum);

            // Generar el hash del mensaje como en el script funcional
            const messageHash = web3.utils.soliditySha3(
                { type: 'address', value: account },
                { type: 'address', value: recipient },
                { type: 'uint256', value: amount }
            );

            console.log("Hash del mensaje generado:", messageHash);

            // Firmar el hash con MetaMask (sin aplicar prefijos manuales)
            const signature = await window.ethereum.request({
                method: 'personal_sign',
                params: [messageHash, account],
            });

            console.log("Firma generada:", signature);

            const paymentData = {
                signature,
                from: account,
                to: recipient,
                amount: amount,
            };

            console.log("Datos del pago:", paymentData);

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
