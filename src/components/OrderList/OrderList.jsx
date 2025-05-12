import { api } from "../../services/api"
import { useEffect, useState } from "react"
import { PreViewOrder } from "../PreViewOrder/PreViewOrder"
// import './OrderList.css'
import { Loading } from "../Loading/Loading"
import { Pagination } from "../Pagination/Pagination"

export function OrderList({ status, year, month }) {

    const { Order } = api
    const [orders, setOrders] = useState(null)
    const [page, setPage] = useState(1)

    async function getOrders() {
        const order = new Order()

        const response = await order.get({ status, year, month, page })

        setOrders(response)
    }

    useEffect(() => {
        setOrders(null)
        getOrders()
    }, [status, page])

    return (
        <>
            <div className="container-orders">
                {orders ?
                    orders.data.length !== 0 ?
                        orders.data.map((e) => (
                            <PreViewOrder key={e.id} order={e} setOrders={setOrders} />
                        )) :
                        <p>No hay pedidos</p> :
                    <Loading />
                }
            </div>
            <Pagination currentPage={page} onPageChange={setPage} lastPage={orders?.last_page} />
        </>
    )
}