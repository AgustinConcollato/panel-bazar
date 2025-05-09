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
                        <span>Descuento</span>
                        <p>{order.discount || 0}%</p>
                    </div>
                    <div>
                        {order.discount && (
                            <>
                                <span>Precio con descuento</span>
                                <p>
                                    ${order.total_amount - (order.total_amount * order.discount) / 100}
                                </p>
                            </>
                        )}
                    </div>
                </div>
                <div>
                    <span>Métodos de pago</span>
                    {order.payments.length > 0 ?
                        order.payments.map((e) =>
                            <p>
                                {e.method === 'transfer' && `Transferencia - $${e.expected_amount}`}
                                {e.method === 'cash' && `Efectivo - $${e.expected_amount}`}
                                {e.method === 'check' && `Cheque - $${e.expected_amount}`}
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
                            <span>Comentario</span>
                            <p>{order.comment}</p>
                        </>
                    }
                </div>
            </Link>
            <OrderOptions order={order} onAction={setOrders} />
        </div>
    )
}