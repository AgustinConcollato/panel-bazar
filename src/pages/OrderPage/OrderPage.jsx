import { useEffect } from "react"
import { Navigate, NavLink, Route, Routes } from "react-router-dom"
import { CompletedOrdersSummary } from "../../components/CompletedOrdersSummary/CompletedOrdersSummary"
import { CreateOrder } from "../../components/CreateOrder/CreateOrder"
import { OrderList } from "../../components/OrderList/OrderList"
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
                <NavLink to='completados' className="link-orders">Completados</NavLink>
                <NavLink to='rechazados' className="link-orders">Rechazados</NavLink>
                <NavLink to='cancelados' className="link-orders">Cancelados</NavLink>
            </nav>
            <Routes>
                <Route index element={<OrderList status={'pending'} />} />
                <Route path='pendientes' element={<OrderList status={'pending'} />} />
                <Route path='aceptados' element={<OrderList status={'accepted'} />} />
                <Route path='completados' element={<OrderList status={'completed'} />} />
                <Route path='rechazados' element={<OrderList status={'rejected'} />} />
                <Route path='cancelados' element={<OrderList status={'cancelled'} />} />
                <Route path="*" element={<Navigate to="/panel" replace />} />
            </Routes>
        </section>
    )
}