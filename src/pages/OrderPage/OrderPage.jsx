import { useEffect } from "react"
import { Navigate, NavLink, Route, Routes } from "react-router-dom"
import { AcceptedOrders } from "../../components/AcceptedOrders/AcceptedOrders"
import { CompletedOrdersSummary } from "../../components/CompletedOrdersSummary/CompletedOrdersSummary"
import { CreateOrder } from "../../components/CreateOrder/CreateOrder"
import { PendingsOrders } from "../../components/PendingsOrders/PendingsOrders"
import './OrderPage.css'

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


            <nav>
                <NavLink to='' end className="link-orders">Pendientes</NavLink>
                <NavLink to='aceptados' className="link-orders">Aceptados</NavLink>
                {/* <NavLink to='rechazados' className="link-orders">Rechazados</NavLink> */}
                {/* <NavLink to='cancelados' className="link-orders">Cancelados</NavLink> */}
            </nav>
            <Routes>
                <Route index element={<PendingsOrders />} />
                <Route path='pendientes' element={<PendingsOrders />} />
                <Route path='aceptados' element={<AcceptedOrders />} />
                {/* <Route path='rechazados' element={<RejectedOrders />} />
                <Route path='cancelados' element={<CancelledOrders />} /> */}
                <Route path="*" element={<Navigate to="/panel" replace />} />
            </Routes>
        </section>
    )
}