import { useEffect } from "react"
import { CompletedOrders } from "../components/CompletedOrders/CompletedOrders"
import { CreateOrder } from "../components/CreateOrder/CreateOrder"
import { PendingsOrders } from "../components/PendingsOrders/PendingsOrders"

export function OrderPage() {

    useEffect(() => {
        document.title = 'Pedidos'
    }, [])

    return (
        <section className="order-page">
            <CreateOrder />
            <PendingsOrders />
            <CompletedOrders />
        </section>
    )
}