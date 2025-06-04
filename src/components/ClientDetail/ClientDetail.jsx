import { Link, useParams } from "react-router-dom"
import { api } from "../../services/api"
import { useEffect, useState } from "react"
import { Loading } from "../Loading/Loading"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft, faCircleExclamation } from "@fortawesome/free-solid-svg-icons"
import './ClientDetail.css'

export function ClientDetail() {

    const { id } = useParams()

    const { Clients } = api

    const [client, setClient] = useState(null)

    async function getClient() {
        const clients = new Clients()
        try {
            const response = await clients.get({id})
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
                        <li>Pagos pendientes: {client.payments.length} <FontAwesomeIcon icon={faCircleExclamation} color="#ff8800" />
                            {client.payments.length === 0 ? ' No hay' : 
                                <ul className="pending-payments-detail">
                                    {client.payments.map((p, i) => (
                                        <li key={p.id || i}>
                                            {/* <span>{p.method === 'cash' ? 'Efectivo' : p.method === 'transfer' ? 'Transferencia' : 'Cheque'}:</span>  */}
                                            <p>
                                                Debe:
                                                ${parseFloat(p.expected_amount - (p.paid_amount || 0)).toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                                            </p>
                                            <p>
                                                De: 
                                                ${parseFloat(p.expected_amount).toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                                            </p>
                                            <Link to={`/pedido/${p.order_id}/completed`} className='btn'>Ver pedido</Link>
                                        </li>
                                    ))}
                                </ul>               
                            }
                        </li>
                    </ul>
                </div>
            ) : (
                <Loading />
            )}
        </section>
    )
}