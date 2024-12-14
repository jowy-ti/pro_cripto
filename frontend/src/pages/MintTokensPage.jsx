import React, { useState } from 'react';
import { prepareAndSendMint } from '../components/Payments/MintTokens';
import Menu from '../components/Menu'; 

const MintPage = () => {
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setErrorMessage] = useState(null);
    const [success, setSuccessMessage] = useState(null);

    const handleMint = async (e) => {
            e.preventDefault();
            setLoading(true);
            setErrorMessage('');
            setSuccessMessage('');
    
            try {
                if (!to || !amount) throw new Error("Por favor completa todos los campos.");
    
                const amountInUnits = parseFloat(amount) * Math.pow(10, 2);
    
                console.log("amountInUnits :", amountInUnits);
    
                console.log("Iniciando el proceso de minado...");
                const receipt = await prepareAndSendMint(to, amount);
    
                if (receipt && receipt.transactionHash) {
                    setSuccessMessage('¡Emision de UPCoins realizada con éxito!');
                    
                }
            } catch (error) {
                console.error("Error en el minado:", error);
                
                if (error.message === "Returned error: execution reverted: Only Relayer can execute this function") {
                    setErrorMessage("Solo el Relayer puede emitir nuevos UPcoins");
                } else {
                    setErrorMessage(error.message || 'Ha ocurrido un error durante el minado.');
                }
            } finally {
                setLoading(false);
            }
        };

    return (
        <div className="mint-tokens-container">
            {/* Cabecera de página */}
            <header className="page-header">
                <h1 className="page-header-title">
                <span className="logo"></span>
                UPCoin
                <span className="separator">|</span>
                <span className="subtitle">Emitir UPCoin</span>
                </h1>
                <Menu />
            </header>

            <div className="header-image-tt">
                {/* Formulario de minado */}
                <div className="transfer-form-container">
                    <span className="logo-bp"></span>
                    <div className="title">Emitir UPCoin</div>

                    <form onSubmit={handleMint}>
                        <div>
                            <label>
                                Dirección del destinatario:
                                <input
                                    type='text'
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Cantidad de UPCoin a minar:
                                <input
                                    type='number'
                                    step='0.01'
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                        <button className='submit-btn' type='submit' disabled={loading}>
                            {loading ? 'Procesando...' : 'Emitir'}
                        </button>
                    </form>
                    {error && <p className='error-message'>{error}</p>}
                    {success && <p className='success-message'>{success}</p>}
                </div>
            </div>

        </div>
    );
};

export default MintPage;