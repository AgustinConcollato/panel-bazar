import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { urlStorage } from '../../../services/api';
import { OrderDetail } from '../OrderDetail/OrderDetail';
import './OrderPending.css';
import { OrderProductTable } from '../../OrderProductTable/OrderProductTable';

export function OrderPending({ order }) {

    const navigate = useNavigate()

    useEffect(() => {
        document.title = `Pedido pendiente de ${order.client_name}`

        if (order.status !== 'pending') {
            navigate(`/pedido/${order.id}/${order.status}`)
        }
    }, [order])

    return (
        <div className="order-confirmed">
            {order ?
                <>
                    <OrderDetail order={order} />
                    <OrderProductTable order={order} />
                </> :
                <Loading />}
        </div>
    )
}