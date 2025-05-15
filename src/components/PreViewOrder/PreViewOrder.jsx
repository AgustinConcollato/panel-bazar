import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import { OrderOptions } from "../OrderOptions/OrderOptions";
import './PreViewOrder.css';

export function PreViewOrder({ order, setOrders }) {

    return (
        <div className="pre-view-order">
            <Link to={`/pedido/${order.id}/${order.status}`}>
                <div className="pre-view-order-header">
                    <h3>{order.client_name}</h3>
                    <p>{formatDate(order.updated_at)}</p>
                </div>
                <div className="prices">
                    <div>
                        <h3 className="title">${order.total_amount}</h3>
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
                                    ${order.total_amount - (order.total_amount * order.discount) / 100}
                                </p>
                            </>
                        )}
                    </div>
                </div>
                <div>
                    <h4>Métodos de pago</h4>
                    {order.payments.length > 0 ?
                        order.payments.map((e) =>
                            <p className="payment-method">
                                {e.method === 'transfer' && <p>Transferencia <span> ${e.expected_amount} {e.paid_at && <FontAwesomeIcon icon={faCircleCheck} color="#66b819" />}</span></p>}
                                {e.method === 'cash' && <p>Efectivo <span> ${e.expected_amount} {e.paid_at && <FontAwesomeIcon icon={faCircleCheck} color="#66b819" />}  </span></p>}
                                {e.method === 'check' && <p>Cheque <span> ${e.expected_amount} {e.paid_at && <FontAwesomeIcon icon={faCircleCheck} color="#66b819" />}  </span></p>}

                            </p>
                        ) :
                        <p>
                            <button className="btn" onClick={e => e.preventDefault()}> Agregar método </button>
                        </p>
                    }
                </div>
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
    )
}