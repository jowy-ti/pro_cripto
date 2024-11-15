import React, { useState, useEffect } from 'react';
import { transferInitialTokens } from '../../services/TransferTokens';
import '../Styles/BlockchainPayment.css';

const RequestInicialTokens = ({ onClose, onCancelRequest }) => {
    const [account, setAccount] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const amount = 100; // Cantidad de tokens a transferir

    useEffect(() => {
        const checkMetaMaskConnection = async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    setAccount(accounts[0]);
                } catch (error) {
                    console.error("Error al conectarse a MetaMask", error);
                    setErrorMessage("Fallo al conectarse a MetaMask. Comprueba si está instalado y desbloqueado.");
                }
            } else {
                setErrorMessage("MetaMask no está instalado. Instálalo para poder solicitar los tokens.");
            }
        };

        checkMetaMaskConnection();
    }, []);

    const handleRequestTokens = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');
        console.log("Iniciando la solicitud de tokens...");

        try {
            if (!window.ethereum) throw new Error("MetaMask no está instalado");

            const message = `Solicitar ${amount} UPCoin para la cuenta ${account}`;

            const signature = await window.ethereum.request({ method: 'personal_sign', params: [message, account] });

            const requestData = {
                signature,
                from: account,
                amount: amount * (10 ** 2),  // Multiplicado por 100 para ajustar los decimales de UPCoin
            };

            const { status, message: responseMessage } = await transferInitialTokens(requestData.amount);
            if (status === 200) {
                setErrorMessage('');
                console.log(responseMessage);
                setSuccessMessage('Tokens solicitados con éxito');
                setTimeout(() => { setSuccessMessage(''); }, 1000);
            } else {
                setErrorMessage(`Error al solicitar tokens: ${responseMessage}`);
                setTimeout(() => { setErrorMessage(''); }, 1000);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(error.message || 'Ha ocurrido un error al solicitar los tokens');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="blockchain-payment">
            <h2>Solicitud de Tokens Iniciales</h2>
            {account ? (
                <p className="txt">Cuenta conectada: {account}</p>
            ) : (
                <p>Por favor conecta tu cuenta de MetaMask wallet</p>
            )}
            <form onSubmit={handleRequestTokens}>
                <div>
                    <p className="txt">Cantidad a solicitar: {amount} UPCoin</p>
                </div>
                <button className="pay" type="submit" disabled={!account || loading}>
                    {loading ? 'Procesando...' : 'Solicitar Tokens'}
                </button>
                <button className="cancel" type="button" onClick={() => { onClose(); onCancelRequest(); }}>
                    Cancelar
                </button>
            </form>
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
            {successMessage && <p className="successMessage">{successMessage}</p>}
        </div>
    );
};

export default RequestInicialTokens;

