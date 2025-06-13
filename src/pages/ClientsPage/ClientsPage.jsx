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
    const [results, setResults] = useState(null)
    const [isSearching, setIsSearching] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    async function searchClient(e) {
        const clientName = e.target.value
        const c = new Clients();

        try {
            if (clientName.trim() === '') {
                setResults(null);
                return;
            }
            setIsSearching(true)
            const response = await c.search(clientName)
            setResults(response.data)
        } catch (error) {
            console.log(error)
            setResults(null)
        } finally {
            setIsSearching(false)
        }
    }

    async function getClients() {
        const clients = new Clients()

        try {
            const response = await clients.get({ source })
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
                    <div className="search-client">
                        <input
                            type="search"
                            className="input"
                            placeholder="Buscar cliente por nombre"
                            onChange={searchClient}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                        />
                        {isFocused && (results || isSearching) && (
                            <div className="results">
                                {isSearching ? (
                                    <div className="loading-results">
                                        <Loading />
                                    </div>
                                ) : results.length > 0 ? (
                                    <ul>
                                        {results.map(client => (
                                            <li key={client.id}>
                                                <Link to={`/cliente/${client.id}`}>
                                                    {client.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No se encontraron clientes</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <Link to={'/agregar-cliente'} className="btn btn-solid">+ Nuevo cliente</Link>
            </div>
            {clients ?
                clients.length != 0 ?
                    <>
                        <p>Cantidad de clientes: {clients.length}</p>
                        <table cellSpacing={0}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Pagos pendientes</th>
                                    <th>Correo</th>
                                    <th>Teléfono</th>
                                    <th>Dirección</th>
                                </tr>
                            </thead>
                            <tbody>
                                <ClientList clients={clients} />
                            </tbody>
                        </table>
                    </> :
                    <p>No hay clientes</p> :
                <Loading />
            }
        </section>
    )
}