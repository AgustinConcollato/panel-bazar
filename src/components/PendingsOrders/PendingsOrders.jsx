import { api } from "api-services"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { formatDate } from '../../utils/formatDate'
import { Loading } from "../Loading/Loading"
import './PendingsOrders.css'

export function PendingsOrders() {

    const { Order } = api
    const [orders, setOrders] = useState(null)

    async function getPendingsOrders() {
        const order = new Order()

        const response = await order.pending()

        setOrders(response)
    }

    const groupOrdersByMonth = (orders) => {
        return orders.reduce((groups, order) => {
            const date = new Date(order.created_at);
            const monthYear = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

            if (!groups[monthYear]) {
                groups[monthYear] = [];
            }
            groups[monthYear].push(order);

            return groups;
        }, {});
    };

    const groupedOrders = orders && groupOrdersByMonth(orders);

    useEffect(() => {
        getPendingsOrders()
    }, [])

    return (
        <div className="pendings-orders">
            <h3 className='title'>Pedidos pendientes</h3>
            <div>
                {orders ?
                    orders.length != 0 ?
                        Object.keys(groupedOrders).map((monthYear) => (
                            <div key={monthYear}>
                                <h4>{monthYear}</h4>
                                {groupedOrders[monthYear].map((e) => (
                                    <Link to={`/pedidos/${e.id}`} key={e.id}>
                                        <span>{e.client_name}</span>
                                        <span>{formatDate(e.created_at)}</span>
                                        <span>Total: ${e.total_amount}</span>
                                    </Link>
                                ))}
                            </div>
                        )) :
                        <p>No hay pedidos pendientes</p>
                    :
                    <Loading />
                }
            </div>
        </div>
    )
}
