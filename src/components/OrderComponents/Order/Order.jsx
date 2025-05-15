import { useEffect, useState } from "react"
import { Navigate, Route, Routes, useParams } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import { api } from "../../../services/api"
import { Loading } from "../../Loading/Loading"
import { AcceptedOrder } from "../AcceptedOrder/AcceptedOrder"
import { CompletedOrder } from "../CompletedOrder/CompletedOrder"
import { OrderPending } from "../OrderPending/OrderPending"
import './Order.css'

export function Order() {

    const { Order } = api
    const { id } = useParams()

    const [order, setOrder] = useState(null)

    async function getOrder(orderId) {

        const order = new Order()
        try {
            const response = await order.detail(orderId)

            document.title = `Pedido de ${response.client_name}`

            setOrder(response)

        } catch (error) {
            console.log(error.message)
        }

    }

    useEffect(() => {
        getOrder(id)
    }, [id])

    if (!order) return <Loading />

    return (
        <>
            <Routes>
                <Route path="pending" element={<OrderPending order={order} />} />
                <Route path="accepted" element={<AcceptedOrder order={order} />} />
                <Route path="completed" element={<CompletedOrder order={order} />} />
                <Route path="canceled" element={'cancelado'} />
                <Route path="*" element={<Navigate to="/pedidos" replace />} />
            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition:Bounce
                stacked />
        </>
    )
}