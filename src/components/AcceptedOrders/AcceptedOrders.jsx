import { api } from "../../services/api"
import { useEffect, useState } from "react"
import { PreViewOrder } from "../PreViewOrder/PreViewOrder"
import './AcceptedOrders.css'
import { Loading } from "../Loading/Loading"

export function AcceptedOrders() {

    const { Order } = api
    const [orders, setOrders] = useState(null)

    async function getAcceptedOrders() {
        const order = new Order()

        const response = await order.accepted()

        setOrders(response)
    }

    useEffect(() => {
        getAcceptedOrders()
    }, [])


    return (
        <div className="accepted-orders">
            <div className="container-orders">
                {orders ?
                    orders.length !== 0 ?
                        orders.map((e) => (
                            <PreViewOrder key={e.id} order={e} />
                        )) :
                        <p>No hay pedidos aceptados</p>
                    :
                    <Loading />
                }
            </div>
        </div>
    )
}