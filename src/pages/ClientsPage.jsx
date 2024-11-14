import { useEffect, useState } from "react"
import { api } from "../services/api"
import { Loading } from "../components/Loading/Loading"
import { Link } from "react-router-dom"
import { ClientList } from "../components/ClientList/ClientList"

export function ClientsPage() {

    const { Clients } = api
    const [clients, setClients] = useState(null)

    async function getClients() {
        const clients = new Clients()

        try {
            const response = await clients.get()
            setClients(response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getClients()
    }, [])

    return (
        <section className="client-page">
            {clients ?
                clients.length != 0 ?
                    <ClientList clients={clients} /> :
                    <p>No hay clientes <Link to={'/agregar-cliente'}>agrega al primero</Link></p> :
                <Loading />
            }
        </section>
    )
}