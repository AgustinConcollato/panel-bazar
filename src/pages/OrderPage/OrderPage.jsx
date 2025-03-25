import { useEffect } from "react"
import { CompletedOrders } from "../../components/CompletedOrders/CompletedOrders"
import { CreateOrder } from "../../components/CreateOrder/CreateOrder"
import { PendingsOrders } from "../../components/PendingsOrders/PendingsOrders"
import './OrderPage.css'
import { CompletedOrdersSummary } from "../../components/CompletedOrdersSummary/CompletedOrdersSummary"

export function OrderPage() {

    useEffect(() => {
        document.title = 'Pedidos'
    }, [])

    return (
        <section className="order-page">
            <div className="header-order-page">
                <CreateOrder />
                <CompletedOrdersSummary />
            </div>
            <PendingsOrders />
            {/* <CompletedOrders /> */}
        </section>
    )
}