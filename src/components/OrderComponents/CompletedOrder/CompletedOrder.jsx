import { useEffect, useState } from 'react'
import { Payments } from '../../../services/paymentsServices'
import { OrderDetail } from '../OrderDetail/OrderDetail'
import './CompletedOrder.css'
import { Loading } from '../../Loading/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleExclamation, faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { Modal } from '../../Modal/Modal'

export function CompletedOrder({ order }) {

    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [confirmPayment, setConfirmPayment] = useState(false)

    async function payOrder(payment) {

        const payments = new Payments()

        try {
            setLoading(true)
            const response = await payments.update(payment.id, {
                paid_amount: payment.expected_amount,
            })
            setPayments(currentPayments => currentPayments.map(p => p.id === payment.id ? response : p))
            setConfirmPayment(false)
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setPayments(order.payments)
    }, [])

    return (
        <div className='order-confirmed'>
            <OrderDetail order={order} />
            <div className='order-payments'>
                <h2>Pagos</h2>
                <ul>
                    {payments.map(payment => (
                        <li onClick={() => !payment.paid_at ? setConfirmPayment(payment) : null}>
                            <p>
                                {payment.method == 'transfer' ? 'Transferencia' : payment.method == 'cash' ? 'Efectivo' : 'Cheque'}
                                <b>${payment.expected_amount}</b>
                            </p>
                            {!payment.paid_at ?
                                <>
                                    <p>Pendiente <FontAwesomeIcon icon={faCircleExclamation} color="#ff8800" /></p>
                                    <span> Confirmar pago </span>
                                </>
                                :
                                <p>Pagado <FontAwesomeIcon icon={faCircleCheck} color="#66b819" /></p>
                            }
                        </li>
                    ))}
                </ul>
            </div>
            {confirmPayment &&
                <Modal>
                    <div className="container-children">
                        <h2>Confirmar pago</h2>
                        <p>¿Estás seguro de que quieres marcar este pago como pagado?</p>
                        {error && <p className='error'>{error}</p>}
                        <button className="btn btn-solid" onClick={() => payOrder(confirmPayment)}>
                            {loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Confirmar'}
                        </button>
                        <button className="btn" onClick={() => setConfirmPayment(false)}>Cancelar</button>
                    </div>
                    <div className="background-modal" onClick={() => setConfirmPayment(false)}></div>
                </Modal>
            }
        </div>
    )
}
