import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import './PaymentOption.css';

export function PaymentOption({ createPay, order, loading }) {

    const [selectedMethod, setSelectedMethod] = useState(null);

    const paymentOptions = ['transfer', 'cash', 'check'];

    function addMethod() {
        const data = {
            order_id: order.id,
            method: selectedMethod,
            expected_amount: order.total_amount,
            paid_amount: 0,
            paid_at: null
        }

        createPay(data)
    }

    function addMethodAndConfirmPay() {
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 19).replace('T', ' '); // Formato: YYYY-MM-DD HH:mm:ss

        const data = {
            order_id: order.id,
            method: selectedMethod,
            expected_amount: order.total_amount,
            paid_amount: order.total_amount,
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
                        </label>
                    </div>
                ))}
            </div>
            {selectedMethod &&
                <div className="container-btn">
                    <button className='btn btn-regular' onClick={addMethod} disabled={loading}>
                        {loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Agregar'}
                    </button>
                    <button className='btn btn-solid' onClick={addMethodAndConfirmPay} disabled={loading}>
                        {loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Agregar y confirmar pago'}
                    </button>
                </div>}
        </div>
    );
}
