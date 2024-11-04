import { useEffect } from "react"
import { CreateOrder } from "../components/CreateOrder/CreateOrder"

export function OrderPage() {

    useEffect(() => {

    }, [])

    return (
        <section className="order-page">
            <div>
                <CreateOrder />
                <div className="orders-pending">
                    mostrar los pedidso pendientes
                </div>
            </div>
            <div className="orders-completed">
                lista de los pedidos terminados del mes
            </div>
        </section>
    )
}