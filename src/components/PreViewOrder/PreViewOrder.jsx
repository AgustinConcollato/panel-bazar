import { faCircleCheck, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Payments } from "../../services/paymentsServices";
import { formatDate } from "../../utils/formatDate";
import { Modal } from "../Modal/Modal";
import { OrderOptions } from "../OrderOptions/OrderOptions";
import { PaymentOption } from "../PaymentOption/PaymentOption";
import './PreViewOrder.css';

export function PreViewOrder({ order, setOrders }) {

    const [payments, setPayments] = useState([])
    const [createLoading, setCreateLoading] = useState(false)
    const [addPayment, setAddPayment] = useState(false)

    async function createPay(data) {
        const payments = new Payments()

        try {
            setCreateLoading(true)
            const response = await payments.create(data)
            setPayments([response.payment])
            setAddPayment(false)
        } catch (error) {
            console.log(error)
        } finally {
            setCreateLoading(false)
        }
    }

    useEffect(() => {
        setPayments(order.payments)
    }, [order])

    return (
        <>
            <div className="pre-view-order">
                <Link to={`/pedido/${order.id}/${order.status}`}>
                    <div className="pre-view-order-header">
                        <h3>{order.client_name}</h3>
                        <p>{formatDate(order.updated_at)}</p>
                    </div>
                    <div className="prices">
                        <div>
                            <h3 className="title">${parseFloat(order.total_amount).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</h3>
                        </div>
                        <div>
                            {order.status === "completed" ?
                                <p className="status-completed">Completado</p> :
                                order.status === "pending" ?
                                    <p className="status-pending">Pendiente</p> :
                                    order.status === "accepted" ?
                                        <p className="status-completed">Aceptado</p> :
                                        order.status === "rejected" ?
                                            <p className="status-rejected">Rechazado</p> :
                                            <p className="status-cancelled">Cancelado</p>
                            }
                        </div>
                    </div>
                    <div className="prices">
                        <div>
                            <h4>Descuento</h4>
                            <p>{order.discount || 0}%</p>
                        </div>
                        <div>
                            {order.discount && (
                                <>
                                    <h4>Precio con descuento</h4>
                                    <p>
                                        ${parseFloat(order.total_amount - (order.total_amount * order.discount) / 100).toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                    {order.status === "completed" &&
                        <div>
                            <h4>Métodos de pago</h4>
                            {payments.length > 0 ?
                                payments.map((e) =>
                                    <p className="payment-method">
                                        {e.method === 'transfer' &&
                                            <p>
                                                Transferencia
                                                <span>
                                                    ${parseFloat(e.paid_amount).toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                                                    {parseFloat(e.paid_amount) >= parseFloat(e.expected_amount)
                                                        ? <FontAwesomeIcon icon={faCircleCheck} color="#66b819" />
                                                        : <FontAwesomeIcon icon={faCircleExclamation} color="#ff8800" />
                                                    }
                                                </span>
                                            </p>
                                         }
                                        {e.method === 'cash' && 
                                            <p>
                                                Efectivo
                                                <span>
                                                     ${parseFloat(e.paid_amount).toLocaleString('es-AR', { maximumFractionDigits: 2 })} 
                                                     {parseFloat(e.paid_amount) >= parseFloat(e.expected_amount)
                                                        ? <FontAwesomeIcon icon={faCircleCheck} color="#66b819" />
                                                        : <FontAwesomeIcon icon={faCircleExclamation} color="#ff8800" />
                                                     }
                                                </span>
                                            </p>
                                        }
                                        {e.method === 'check' &&
                                            <p>
                                                Cheque
                                                <span>
                                                     ${parseFloat(e.paid_amount).toLocaleString('es-AR', { maximumFractionDigits: 2 })} 
                                                     {parseFloat(e.paid_amount) >= parseFloat(e.expected_amount)
                                                        ? <FontAwesomeIcon icon={faCircleCheck} color="#66b819" />
                                                        : <FontAwesomeIcon icon={faCircleExclamation} color="#ff8800" />
                                                     }
                                                </span>
                                            </p>
                                         }

                                    </p>
                                ) :
                                <p>
                                    <button className="btn"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setAddPayment(true)
                                        }}
                                    >
                                        Agregar método
                                    </button>
                                </p>
                            }
                        </div> 
                    }
                    <div className="pre-view-order-comment">
                        {order.comment &&
                            <>
                                <h4>Comentario</h4>
                                <p>{order.comment}</p>
                            </>
                        }
                    </div>
                </Link>
                <OrderOptions order={order} onAction={setOrders} />
            </div>
            {addPayment &&
                <Modal>
                    <div className="container-children">
                        <h2>Agregar método de pago</h2>
                        <PaymentOption createPay={createPay} order={order} loading={createLoading} />
                    </div>
                    <div className="background-modal" onClick={() => setAddPayment(false)}></div>
                </Modal>
            }
        </>
    )
}