import { faCheckCircle, faCircleExclamation, faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { Payments } from '../../../services/paymentsServices'
import { Modal } from '../../Modal/Modal'
import { OrderProductTable } from '../../OrderProductTable/OrderProductTable'
import { PaymentOption } from '../../PaymentOption/PaymentOption'
import { OrderDetail } from '../OrderDetail/OrderDetail'
import './CompletedOrder.css'

export function CompletedOrder({ order, getOrder }) {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(false)
    const [createLoading, setCreateLoading] = useState(false)
    const [confirmPayment, setConfirmPayment] = useState(false)
    const [completePayment, setCompletePayment] = useState(false)
    const [partialPayment, setPartialPayment] = useState(null)
    const [partialAmount, setPartialAmount] = useState('')

    // Calcular descuento y total con descuento
    const discountAmount = order.discount ? (parseFloat(order.total_amount) * (order.discount / 100)) : 0;
    const totalWithDiscount = parseFloat(order.total_amount) - discountAmount;

    async function createPay(data) {
        const payments = new Payments()

        try {
            setCreateLoading(true)
            const response = await payments.create(data)
            setPayments([response.payment])
            getOrder(order.id)
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
            getOrder(order.id)
        } catch (error) {
            toast.error(error?.message || 'Error al confirmar pago');
        } finally {
            setLoading(false)
        }
    }

    async function completeRemainingPayment(payment) {
        const payments = new Payments()
        const remainingAmount = payment.expected_amount - (payment.paid_amount || 0)
        try {
            setLoading(true)
            const response = await payments.update(payment.id, {
                paid_amount: payment.expected_amount,
            })
            setPayments(currentPayments => currentPayments.map(p => p.id === payment.id ? response : p))
            setCompletePayment(false)
            getOrder(order.id)
        } catch (error) {
            toast.error(error?.message || 'Error al completar pago');
        } finally {
            setLoading(false)
        }
    }

    async function addPartialPayment(payment, amount) {
        const payments = new Payments()
        const remaining = payment.expected_amount - (parseFloat(payment.paid_amount) || 0)
        if (parseFloat(amount) > remaining) {
            toast.error('El monto ingresado supera el monto restante.');
            setLoading(false);
            return;
        }
        try {
            setLoading(true)
            const newPaidAmount = (parseFloat(payment.paid_amount) || 0) + parseFloat(amount)
            const response = await payments.update(payment.id, {
                paid_amount: newPaidAmount,
            })
            setPayments(currentPayments => currentPayments.map(p => p.id === payment.id ? response : p))
            setPartialPayment(null)
            setPartialAmount('')
            getOrder(order.id)
        } catch (error) {
            toast.error(error?.message || 'Error al agregar pago parcial');
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        order.status = 'completed'
        setPayments(order.payments)
        getOrder(order.id)
    }, [])

    // Calcula el total pagado sobre el total con descuento
    const calculateTotalPaid = () => {
        return payments.reduce((total, payment) => total + (parseFloat(payment.paid_amount) || 0), 0)
    }
    const isFullyPaid = () => {
        return calculateTotalPaid() >= totalWithDiscount;
    }

    // Calcula el color de la barra de progreso según el porcentaje pagado
    function getProgressColor(percent) {
        if (percent < 0.3) return '#e74c3c'; // rojo
        if (percent < 1) return '#ff8800'; // naranja
        return '#66b819'; // verde
    }

    return (
        <div className='order-completed'>
            <div className='info-order'>
                <OrderDetail order={order} />
                <div className='order-payments'>
                    <h2>Pagos</h2>
                    {payments.length > 0 ?
                        <>
                            <div className="payment-progress">
                                <p>
                                    Subtotal: ${parseFloat(order.total_amount).toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                                </p>
                                <p>
                                    {order.discount
                                        ? <>Descuento ({order.discount}%): -${discountAmount.toLocaleString('es-AR', { maximumFractionDigits: 2 })}</>
                                        : <>Descuento: -$0</>
                                    }
                                </p>
                                <p>
                                    <b>Total con descuento: ${totalWithDiscount.toLocaleString('es-AR', { maximumFractionDigits: 2 })}</b>
                                </p>
                                <p>
                                    Pagado: ${calculateTotalPaid().toLocaleString('es-AR', { maximumFractionDigits: 2 })} de ${totalWithDiscount.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                                </p>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${(calculateTotalPaid() / totalWithDiscount) * 100}%`,
                                            backgroundColor: getProgressColor(Math.min(1, calculateTotalPaid() / totalWithDiscount))
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <ul>
                                {payments.map(payment => (
                                    <li key={payment.id}>
                                        <p>
                                            Método: {payment.method == 'transfer' ? 'Transferencia' : payment.method == 'cash' ? 'Efectivo' : payment.method == 'check' ? 'Cheque' : 'Tarjeta de crédito / débito'}
                                        </p>
                                        <p>
                                            Estado:
                                            {!isFullyPaid() ?
                                                <span> Pendiente <FontAwesomeIcon icon={faCircleExclamation} color="#ff8800" /></span> :
                                                <span> Completado <FontAwesomeIcon icon={faCheckCircle} color="#66b819" /></span>
                                            }
                                        </p>
                                        {parseFloat(payment.paid_amount) < parseFloat(payment.expected_amount) && (
                                            <div className='container-btn'>
                                                <button
                                                    className="btn btn-solid"
                                                    onClick={() => setCompletePayment(payment)}
                                                >
                                                    Completar pago
                                                </button>
                                                <button
                                                    className="btn btn-solid"
                                                    onClick={() => {
                                                        setPartialPayment(payment)
                                                        setPartialAmount('')
                                                    }}
                                                >
                                                    Agregar pago parcial
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </>
                        :
                        <div className='order-payments-empty'>
                            <p>No hay pagos</p>
                            <div className="payment-methods">
                                <p>Agregar un método de pago</p>
                                <PaymentOption
                                    createPay={createPay}
                                    order={order}
                                    loading={createLoading}
                                />
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className="info-order">
                <OrderProductTable order={order} />
            </div>
            {confirmPayment &&
                <Modal onClose={() => setConfirmPayment(false)}>
                    <div className='container-payment-modal'>
                        <h2>Confirmar pago</h2>
                        <p>¿Estás seguro de que quieres marcar este pago como pagado?</p>
                        {error && <p className='error'>{error}</p>}
                        <button className="btn btn-solid" onClick={() => payOrder(confirmPayment)}>
                            {loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Confirmar'}
                        </button>
                        <button className="btn" onClick={() => setConfirmPayment(false)}>Cancelar</button>
                    </div>
                </Modal>
            }
            {completePayment &&
                <Modal onClose={() => setCompletePayment(false)}>
                    <div className='container-payment-modal'>
                        <h2>Completar pago</h2>
                        <p>¿Estás seguro de que quieres marcar el pago restante como pagado?</p>
                        <p>Monto restante: ${(completePayment.expected_amount - (completePayment.paid_amount || 0)).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</p>
                        <button className="btn btn-solid" onClick={() => completeRemainingPayment(completePayment)}>
                            {loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Completar'}
                        </button>
                        <button className="btn" onClick={() => setCompletePayment(false)}>Cancelar</button>
                    </div>
                </Modal>
            }
            {partialPayment &&
                <Modal onClose={() => setPartialPayment(null)}>
                    <div className='container-payment-modal'>
                        <h2>Agregar pago parcial</h2>
                        <div>
                            <p>Pagado actual: ${parseFloat(partialPayment.paid_amount || 0).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</p>
                            <p>Monto restante: ${(partialPayment.expected_amount - (partialPayment.paid_amount || 0)).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</p>
                        </div>
                        <input
                            className='input'
                            type="number"
                            min="0.01"
                            max={partialPayment.expected_amount - (partialPayment.paid_amount || 0)}
                            step="0.01"
                            value={partialAmount}
                            onChange={e => setPartialAmount(e.target.value)}
                            placeholder="Monto a agregar"
                            onKeyUp={(e) => {
                                if (e.key === 'Enter') { addPartialPayment(partialPayment, partialAmount) }
                            }}
                        />
                        <button
                            className="btn btn-solid"
                            disabled={!partialAmount || parseFloat(partialAmount) <= 0}
                            onClick={() => addPartialPayment(partialPayment, partialAmount)}
                        >
                            {loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Agregar'}
                        </button>
                        <button className="btn" onClick={() => setPartialPayment(null)}>Cancelar</button>
                    </div>
                </Modal>
            }
            <ToastContainer />
        </div>
    )
}
