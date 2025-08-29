import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import './PaymentOption.css';
import { toast } from 'react-toastify';

export function PaymentOption({ createPay, order, loading, remainingAmount }) {
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [paidAmount, setPaidAmount] = useState();
    const [reload, setReload] = useState(false);

    const paymentOptions = ['transfer', 'cash', 'check', 'credit_card'];

    const getFinalAmount = () => {
        if (selectedMethod === 'credit_card') {
            return paidAmount ? parseFloat(paidAmount) * 1.10 : '';
        }
        return paidAmount;
    };

    function addMethodAndConfirmPay() {
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');

        const finalAmount = selectedMethod === 'credit_card'
            ? parseFloat(paidAmount) * 1.10
            : parseFloat(paidAmount);

        if (finalAmount > remainingAmount && selectedMethod !== 'credit_card') {
            return toast.error('El monto a pagar es mayor al monto restante');
        }

        const data = {
            order_id: order.id,
            method: selectedMethod,
            expected_amount: finalAmount,
            paid_amount: finalAmount,
            paid_at: formattedDate
        };

        createPay(data)
        setSelectedMethod(null)
        setPaidAmount(null)
        setReload(true)

        setTimeout(() => {
            setReload(false)
        }, 100);
    }

    return (
        reload ? <div>Cargando...</div> :
            <div className='payment-method-controls'>
                <div className='container-btn'>
                    {paymentOptions.map(method => (
                        <div key={method} className='methods'>
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    onChange={() => setSelectedMethod(method)}
                                />
                                {method === 'transfer' && 'Transferencia'}
                                {method === 'cash' && 'Efectivo'}
                                {method === 'check' && 'Cheque'}
                                {method === 'credit_card' && 'tarjeta de crédito / débito'}
                            </label>
                        </div>
                    ))}
                </div>
                {selectedMethod && (
                    <>
                        <div className="amount-input">
                            <p>
                                Monto restante a pagar: {parseFloat(remainingAmount).toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                                {selectedMethod === 'credit_card' && (
                                    <span style={{ color: 'red', marginLeft: 10 }}>
                                        (Recargo 10% incluido)
                                    </span>
                                )}
                            </p>
                            <div>
                                <input
                                    className='input'
                                    placeholder='Monto a pagar'
                                    type="number"
                                    value={paidAmount}
                                    onChange={(e) => setPaidAmount(e.target.value)}
                                    min="0"
                                    max={remainingAmount}
                                    step="0.01"
                                />
                                <div className="container-btn">
                                    <button onClick={() => setPaidAmount(remainingAmount / 2)}>Mitad del monto restante</button>
                                    <button onClick={() => setPaidAmount(remainingAmount)}>Monto restante</button>
                                </div>
                            </div>
                            {selectedMethod === 'credit_card' && paidAmount && (
                                <p>
                                    Total con recargo: <b>${getFinalAmount().toLocaleString('es-AR', { maximumFractionDigits: 2 })}</b>
                                </p>
                            )}
                        </div>
                        <div className="container-btn">
                            <button className='btn btn-solid' onClick={addMethodAndConfirmPay} disabled={loading}>
                                {loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Confirmar pago'}
                            </button>
                        </div>
                    </>
                )}
            </div>
    );
}
