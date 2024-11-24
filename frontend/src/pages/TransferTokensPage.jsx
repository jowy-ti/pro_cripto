// src/pages/TransferTokensPage.jsx
import React, { useState, useEffect } from 'react';
import { prepareAndSendPayment } from '../components/Payments/TransferTokens';
import '../components/Styles/TransferTokensPage.css';

const BlockchainTransfer = ({ onClose }) => {
    const [account, setAccount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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
                setErrorMessage("MetaMask no está instalado. Instálalo para poder transferir tokens.");
            }
        };

        checkMetaMaskConnection();
    }, []);

    const handleTransfer = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            if (!account) throw new Error("No hay una cuenta conectada.");
            if (!recipient || !amount) throw new Error("Por favor completa todos los campos.");

            const amountInUnits = parseFloat(amount) * Math.pow(10, 2);

            console.log("Iniciando el proceso de transferencia...");
            const { status, data } = await prepareAndSendPayment(account, recipient, amountInUnits);

            if (status === 200) {
                setSuccessMessage('Transferencia realizada con éxito.');
                console.log(data);
            } else {
                throw new Error(`Error en el servidor: ${data.error || "Desconocido"}`);
            }
        } catch (error) {
            console.error("Error en la transferencia:", error);
            setErrorMessage(error.message || 'Ha ocurrido un error durante la transferencia.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='transfer-form'>
            <h2>Transferir Tokens</h2>
            {account ? (
                <div className="account-info">
                    <label>Cuenta conectada:</label>
                    <p className="account-address">{account}</p>
                </div>
            ) : (
                <p>Por favor conecta tu cuenta de MetaMask.</p>
            )}
            <form onSubmit={handleTransfer}>
                <div>
                    <label>
                        Dirección del destinatario:
                        <input
                            type='text'
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Cantidad de UPCoin a transferir:
                        <input
                            type='number'
                            step='0.01'
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button className='submit-btn' type='submit' disabled={!account || loading}>
                    {loading ? 'Procesando...' : 'Firmar y Transferir'}
                </button>
                <button className='cancel-btn' type='button' onClick={onClose}>Cancelar</button>
            </form>
            {errorMessage && <p className='error-message'>{errorMessage}</p>}
            {successMessage && <p className='success-message'>{successMessage}</p>}
        </div>
    );
};

export default BlockchainTransfer;