import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ClientList } from "../../components/ClientList/ClientList"
import { Loading } from "../../components/Loading/Loading"
import { api } from "../../services/api"
import './ClientsPage.css'

export function ClientsPage() {

    const { Clients } = api
    const [clients, setClients] = useState(null)
    const [source, setSource] = useState('dashboard')

    async function getClients() {
        const clients = new Clients()

        try {
            const response = await clients.get({source})
            setClients(response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getClients()
        document.title = 'Clientes'
    }, [source])

    return (
        <section className="client-page">
            <div className="header-client-page">
                <div>
                    <select 
                            className="input"
                            onChange={(e) => setSource(e.target.value)} value={source}
                        >
                        <option value="dashboard">Panel</option>
                        <option value="web">Web</option>
                    </select>
                </div>
                <Link to={'/agregar-cliente'} className="btn btn-solid">+ Nuevo cliente</Link>
            </div>
            {clients ?
                clients.length != 0 ?
                <>
                    <p>Cantidad de clientes: {clients.length}</p>
                    <ClientList clients={clients} /> 
                </> :
                    <p>No hay clientes</p> :
                <Loading />
            }
        </section>
    )
}