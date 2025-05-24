import { faCircleCheck, faCircleExclamation, faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Payments } from '../../../services/paymentsServices'
import { Modal } from '../../Modal/Modal'
import { PaymentOption } from '../../PaymentOption/PaymentOption'
import { OrderDetail } from '../OrderDetail/OrderDetail'
import './CompletedOrder.css'
import { useNavigate } from 'react-router-dom'

export function CompletedOrder({ order }) {

    const navigate = useNavigate()

    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(false)
    const [createLoading, setCreateLoading] = useState(false)
    const [error, setError] = useState(false)
    const [confirmPayment, setConfirmPayment] = useState(false)

    async function createPay(data) {
        const payments = new Payments()

        try {
            setCreateLoading(true)
            const response = await payments.create(data)
            setPayments([response.payment])
        } catch (error) {
            console.log(error)
        } finally {
            setCreateLoading(false)
        }
    }

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
        order.status = 'completed'
        setPayments(order.payments)
    }, [])

    return (
        <div className='order-confirmed'>
            <OrderDetail order={order} />
            <div className='order-payments'>
                <h2>Pagos</h2>
                {payments.length > 0 ?
                    <ul>
                        {payments.map(payment => (
                            <li onClick={() => !payment.paid_at ? setConfirmPayment(payment) : null}>
                                <p>
                                    {payment.method == 'transfer' ? 'Transferencia' : payment.method == 'cash' ? 'Efectivo' : 'Cheque'}
                                    <b>${parseFloat(payment.expected_amount).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</b>
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
                    </ul> :
                    <div className='order-payments-empty'>
                        <p>No hay pagos</p>
                        <div className="payment-methods">
                            <p>Agregar un métodos de pago</p>
                            <PaymentOption
                                createPay={createPay}
                                order={order}
                                loading={createLoading}
                            />
                        </div>
                    </div>
                }
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
