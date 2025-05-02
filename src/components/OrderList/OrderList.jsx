import { api } from "../../services/api"
import { useEffect, useState } from "react"
import { PreViewOrder } from "../PreViewOrder/PreViewOrder"
// import './OrderList.css'
import { Loading } from "../Loading/Loading"

export function OrderList({ status }) {

    const { Order } = api
    const [orders, setOrders] = useState(null)

    async function getOrders() {
        const order = new Order()

        const response = await order.get({ status })

        setOrders(response)
    }

    useEffect(() => {
        setOrders(null)
        getOrders()
    }, [status])


    return (
        <div className="container-orders">
            {orders ?
                orders.length !== 0 ?
                    orders.map((e) => (
                        <PreViewOrder key={e.id} order={e} setOrders={setOrders}/>
                    )) :
                    <p>No hay pedidos</p>
                :
                <Loading />
            }
        </div>
    )
}