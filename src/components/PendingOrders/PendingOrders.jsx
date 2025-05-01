import { api } from "../../services/api"
import { useEffect, useState } from "react"
import { Loading } from "../Loading/Loading"
import { PreViewOrder } from "../PreViewOrder/PreViewOrder"
import './PendingOrders.css'

export function PendingOrders() {

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
            <div>
                {orders ?
                    orders.length != 0 ?
                        Object.keys(groupedOrders).map((monthYear) => (
                            <div key={monthYear}>
                                <h4>{monthYear}</h4>
                                <div className="container-orders">
                                    {groupedOrders[monthYear].map((e) => (
                                        <PreViewOrder key={e.id} order={e} setOrders={setOrders} />
                                    ))}
                                </div>
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
