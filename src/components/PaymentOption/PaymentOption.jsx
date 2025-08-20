import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import './PaymentOption.css';
import { toast } from 'react-toastify';

export function PaymentOption({ createPay, order, loading }) {
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [paidAmount, setPaidAmount] = useState();

    const paymentOptions = ['transfer', 'cash', 'check', 'credit_card'];

    const discountedAmount = order.discount
        ? order.total_amount - (order.total_amount * order.discount / 100)
        : order.total_amount;

    function addMethod() {
        const data = {
            order_id: order.id,
            method: selectedMethod,
            expected_amount: discountedAmount,
            paid_amount: 0,
            paid_at: null
        }

        createPay(data)
    }

    function addMethodAndConfirmPay() {
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');

        if (parseFloat(paidAmount) > discountedAmount) {
            return toast.error('Monto a pagar es mayor al total del pedido')
        }

        const data = {
            order_id: order.id,
            method: selectedMethod,
            expected_amount: discountedAmount,
            paid_amount: parseFloat(paidAmount),
            paid_at: formattedDate
        }

        createPay(data)
    }

    return (
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
                        <p>Monto a pagar de {discountedAmount}</p>
                        <div>
                            <input
                                className='input'
                                placeholder='Monto a pagar'
                                type="number"
                                value={paidAmount}
                                onChange={(e) => setPaidAmount(e.target.value)}
                                min="0"
                                max={discountedAmount}
                                step="0.01"
                            />
                            <div className="container-btn">
                                <button onClick={() => setPaidAmount(discountedAmount / 2)}>Mitad del monto total</button>
                                <button onClick={() => setPaidAmount(discountedAmount)}>Monto total</button>
                            </div>
                        </div>
                    </div>
                    <div className="container-btn">
                        <button className='btn btn-solid' onClick={addMethodAndConfirmPay} disabled={loading}>
                            {loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Agregar y confirmar pago'}
                        </button>
                        <button className='btn btn-regular' onClick={addMethod} disabled={loading}>
                            {loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Agregar método'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
