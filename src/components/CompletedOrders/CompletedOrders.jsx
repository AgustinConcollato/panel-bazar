import { useEffect, useState } from "react"
import { api } from "api-services"
import { Link } from "react-router-dom"
import { formatDate } from "../../utils/formatDate"
import { Loading } from "../Loading/Loading"
import './CompletedOrders.css'

export function CompletedOrders() {

    const { Order } = api
    const [orders, setOrders] = useState(null)

    async function getCompletedOrders() {
        const order = new Order()
        const respone = await order.completed()
        setOrders(respone)
    }

    useEffect(() => {
        getCompletedOrders()
    }, [])

    return (
        <div className="completed-orders">
            <h3>Pedidos terminados del mes</h3>
            <div className="container-orders-completed">
                {orders ?
                    orders.length != 0 ?
                        orders.map(e =>
                            <Link to={`/pedido/${e.id}`}>
                                <div>
                                    <h4>{e.client_name}</h4>
                                    <span>{formatDate(e.date)}</span>
                                </div>
                                <div>
                                    {e.discount ?
                                        <>
                                            <p><span>-{e.discount}%</span><span>${e.total_amount}</span></p>
                                            <p>${e.total_amount - (e.total_amount * e.discount) / 100}</p>
                                        </>
                                        :
                                        <span>${e.total_amount}</span>}
                                </div>
                            </Link>) :
                        <p>No hay pedidos terminados</p> :
                    <Loading />
                }
            </div>
        </div>
    )
}