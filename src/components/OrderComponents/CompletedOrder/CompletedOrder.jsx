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

    // Calcular descuento y total con descuento
    const discountAmount = order.discount ? (parseFloat(order.total_amount) * (order.discount / 100)) : 0;
    const totalWithDiscount = parseFloat(order.total_amount) - discountAmount;

    async function createPay(data) {
        const payments = new Payments()

        try {
            setCreateLoading(true)
            const response = await payments.create(data)
            setPayments(currentPayments => [...currentPayments, response.payment])
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

    useEffect(() => {
        order.status = 'completed'
        setPayments(order.payments)
        getOrder(order.id)
    }, [])

    // Calcula el total pagado sobre el total con descuento
    const calculateTotalPaid = () => {
        return payments.reduce((total, payment) => total + (parseFloat(payment.paid_amount) || 0), 0)
    }
    const calculateRemainingAmount = () => {
        return Math.max(0, totalFinal - calculateTotalPaid());
    }

    const calculateCreditCardSurcharge = () => {
        return payments
            .filter(p => p.method === "credit_card")
            .reduce((total, payment) => total + (parseFloat(payment.paid_amount) - ((parseFloat(payment.paid_amount) * 100) / 110)), 0);
    };

    // Calcula el color de la barra de progreso según el porcentaje pagado
    function getProgressColor(percent) {
        if (percent < 0.3) return '#e74c3c'; // rojo
        if (percent < 1) return '#ff8800'; // naranja
        return '#66b819'; // verde
    }

    const totalSurcharge = calculateCreditCardSurcharge();
    const totalFinal = totalWithDiscount + (!order.surcharge ? totalSurcharge : 0);

    return (
        <div className='order-completed'>
            <div className='info-order'>
                <OrderDetail order={order} />
                <div className='order-payments'>
                    {payments.length > 0 ?
                        <>
                            <div className='order-payments-list'>
                                <h2>Pagos</h2>
                                <ul>
                                    {payments.map(payment => (
                                        <li
                                            key={payment.id}
                                            onClick={() => payment.paid_amount < payment.expected_amount ? setCompletePayment(payment) : null}
                                            className={payment.paid_amount < payment.expected_amount ? 'incomplete' : 'complete'}
                                        >
                                            <p>
                                                {payment.paid_amount < payment.expected_amount && <FontAwesomeIcon icon={faCircleExclamation} color="#ff8800" />}
                                                {payment.method == 'transfer' ?
                                                    ' Transferencia' :
                                                    payment.method == 'cash' ?
                                                        ' Efectivo' :
                                                        payment.method == 'check' ?
                                                            ' Cheque' :
                                                            ' Tarjeta de crédito / débito'}
                                            </p>
                                            {payment.method === "credit_card" ?
                                                <p>
                                                    <b>${((parseFloat(payment.paid_amount) * 100) / 110).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</b> +
                                                    {
                                                        order.surcharge ?
                                                            <b> ${parseFloat(order.surcharge).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</b> :
                                                            <b> ${(parseFloat(payment.paid_amount) - ((parseFloat(payment.paid_amount) * 100) / 110)).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</b>
                                                    } =
                                                    <b> ${parseFloat(payment.paid_amount).toLocaleString('es-AR', { maximumFractionDigits: 2 })} </b>
                                                </p> :
                                                <p>
                                                    <b> ${parseFloat(payment.paid_amount).toLocaleString('es-AR', { maximumFractionDigits: 2 })} </b>
                                                </p>
                                            }
                                            {payment.paid_amount < payment.expected_amount && <span>Confirmar pago</span>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <h2>Resumen de los pagos</h2>
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
                                {totalSurcharge > 0 &&
                                    <p>
                                        Recargos: +${(parseFloat(order.surcharge) ?? totalSurcharge).toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                                    </p>
                                }
                                <p>
                                    <b>Total con descuento: ${totalWithDiscount.toLocaleString('es-AR', { maximumFractionDigits: 2 })}</b>
                                </p>
                                {totalSurcharge > 0 &&
                                    <p>
                                        <b>Total final (con recargos): ${totalFinal.toLocaleString('es-AR', { maximumFractionDigits: 2 })}</b>
                                    </p>
                                }
                                <p>
                                    Pagado: ${calculateTotalPaid().toLocaleString('es-AR', { maximumFractionDigits: 2 })} de
                                    ${totalFinal.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                                </p>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${(calculateTotalPaid() / totalFinal) * 100}%`,
                                            backgroundColor: getProgressColor(Math.min(1, calculateTotalPaid() / totalFinal))
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </>
                        :
                        <div className='order-payments-empty'>
                            <p>No hay pagos</p>
                        </div>
                    }
                </div>
                {((payments.length == 0 || calculateRemainingAmount() > 0) && payments[0]?.expected_amount != totalFinal) &&
                    <div className="payment-methods">
                        <p>Agregar un método de pago</p>
                        <PaymentOption
                            createPay={createPay}
                            order={order}
                            loading={createLoading}
                            remainingAmount={calculateRemainingAmount()}
                        />
                    </div>}
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
                        <h2>Confirmar pago</h2>
                        <p>¿Estás seguro de que quieres marcar el pago como pagado?</p>
                        <p>Monto restante: ${(completePayment.expected_amount - (completePayment.paid_amount || 0)).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</p>
                        <button className="btn btn-solid" onClick={() => completeRemainingPayment(completePayment)}>
                            {loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Confirmar pago'}
                        </button>
                        <button className="btn" onClick={() => setCompletePayment(false)}>Cancelar</button>
                    </div>
                </Modal>
            }
            <ToastContainer />
        </div>
    )
}
