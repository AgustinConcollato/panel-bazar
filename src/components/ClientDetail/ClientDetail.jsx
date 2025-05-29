import { Link, useParams } from "react-router-dom"
import { api } from "../../services/api"
import { useEffect, useState } from "react"
import { Loading } from "../Loading/Loading"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons"

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
        document.title = 'Detalle del cliente' + client?.name
    }, [id])

    return (
        <section className="client-page">
            <div className="header-client-page">
                <Link to={'/clientes'}><FontAwesomeIcon icon={faAngleLeft} /> Volver</Link>
            </div>
            {client ? (
                <div className="client-detail">
                    <h1>Detalle del cliente: {client.name}</h1>
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
                        <li>Pagos pendientes: 
                            {client.payments.length === 0 ? ' No hay' : 
                                client.payments.map((p, i) => (
                                    <div key={i}>
                                        <span>{p.method === 'cash' ? 'Efectivo' : p.method === 'transfer' ? 'Transferencia' : 'Cheque'}: </span>
                                        <span>${parseFloat(p.expected_amount - (p.paid_amount || 0)).toLocaleString('es-AR', { maximumFractionDigits: 2 })} / ${parseFloat(p.expected_amount).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</span>
                                    </div>
                                ))
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