import { Link, Navigate, NavLink, Route, Routes, useParams } from "react-router-dom"
import { api } from "../../services/api"
import { useEffect, useState } from "react"
import { Loading } from "../Loading/Loading"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft, faCircleExclamation } from "@fortawesome/free-solid-svg-icons"
import { PreViewOrder } from "../PreViewOrder/PreViewOrder"
import './ClientDetail.css'
import { OrderList } from "../OrderList/OrderList"

export function ClientDetail() {

    const { id } = useParams()

    const { Clients } = api

    const [client, setClient] = useState(null)

    async function getClient() {
        const clients = new Clients()
        try {
            const response = await clients.get({ id })
            setClient(response)
        } catch (error) {
            console.error("Error fetching client details:", error)
        }
    }

    useEffect(() => {
        getClient()
    }, [id])

    useEffect(() => {
        document.title = 'Detalle de ' + client?.name
    }, [client])

    return (
        <section className="client-page">
            <div className="header-client-page">
                <Link to={'/clientes'}><FontAwesomeIcon icon={faAngleLeft} /> Volver</Link>
            </div>
            {client ? (
                <div className="client-detail">
                    <h1>Detalle de {client.name}</h1>
                    <ul>
                        <li>Correo: {client.email}</li>
                        <li>Teléfono: {client.phone_number}</li>
                        <li>Dirección:
                            {client.address.length > 0 ? (
                                <ul>
                                    {client.address.map((addr, idx) => (
                                        <li key={addr.id || idx}>
                                            {addr.city ? `${addr.city}, ` : ''}
                                            {addr.province ? `${addr.province}, ` : ''}
                                            {addr.address ? `${addr.address}, ` : ''}
                                            {addr.address_number ? `${addr.address_number}, ` : ''}
                                            {addr.code_zip ? `${addr.code_zip}` : ''}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <span>Sin direcciones</span>
                            )}
                        </li>
                        {client.debt > 0 ?
                            <li className="client-debt-warning">
                                <FontAwesomeIcon icon={faCircleExclamation} color="#ff8800" />
                                Pagos pendientes por un total de
                                <b> ${parseFloat(client.debt).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</b>
                            </li> :
                            <li className="client-no-debt">No hay pagos pendientes</li>
                        }

                    </ul>
                    <nav>
                        <NavLink to='' end className="link-orders">Completados</NavLink>
                        <NavLink to='pendientes' className="link-orders">Pendientes</NavLink>
                        <NavLink to='aceptados' className="link-orders">Aceptados</NavLink>
                        <NavLink to='rechazados' className="link-orders">Rechazados</NavLink>
                        <NavLink to='cancelados' className="link-orders">Cancelados</NavLink>
                    </nav>
                    <Routes>
                        <Route index element={<OrderList status={'completed'} clientId={client.id} />} />
                        <Route path='pendientes' element={<OrderList status={'pending'} clientId={client.id} />} />
                        <Route path='aceptados' element={<OrderList status={'accepted'} clientId={client.id} />} />
                        <Route path='completados' element={<OrderList status={'completed'} clientId={client.id} />} />
                        <Route path='rechazados' element={<OrderList status={'rejected'} clientId={client.id} />} />
                        <Route path='cancelados' element={<OrderList status={'cancelled'} clientId={client.id} />} />
                        <Route path="*" element={<Navigate to="/panel" replace />} />
                    </Routes>
                </div>
            ) : (
                <Loading />
            )}
        </section>
    )
}