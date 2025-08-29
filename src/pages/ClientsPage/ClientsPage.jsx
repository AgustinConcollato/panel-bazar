import { useEffect, useState, useRef } from "react"
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
    const [loading, setLoading] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const resultsRef = useRef(null)

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

        setLoading(true)
        try {
            const response = await clients.get({ source })
            setClients(response)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getClients()
        document.title = 'Clientes'
    }, [source])

    const handleKeyDown = (e) => {
        if (!results || results.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < results.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev > 0 ? prev - 1 : prev
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < results.length) {
                    window.location.href = `/cliente/${results[selectedIndex].id}`;
                }
                break;
            case 'Escape':
                setIsFocused(false);
                setSelectedIndex(-1);
                break;
        }
    };

    // Reset selected index when results change
    useEffect(() => {
        setSelectedIndex(-1);
    }, [results]);

    // Scroll selected item into view
    useEffect(() => {
        if (selectedIndex >= 0 && resultsRef.current) {
            const resultsContainer = resultsRef.current;
            const selectedElement = resultsContainer.querySelector('ul')?.children[selectedIndex];

            if (selectedElement) {
                const containerRect = resultsContainer.getBoundingClientRect();
                const elementRect = selectedElement.getBoundingClientRect();

                // Check if element is outside the visible area
                if (elementRect.bottom > containerRect.bottom) {
                    // Scroll down to show the element
                    resultsContainer.scrollTop += elementRect.bottom - containerRect.bottom;
                } else if (elementRect.top < containerRect.top) {
                    // Scroll up to show the element
                    resultsContainer.scrollTop -= containerRect.top - elementRect.top;
                }
            }
        }
    }, [selectedIndex]);

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
                            onKeyDown={handleKeyDown}
                        />
                        {isFocused && (results || isSearching) && (
                            <div className="results" ref={resultsRef}>
                                {isSearching ? (
                                    <div className="loading-results">
                                        <Loading />
                                    </div>
                                ) : results.length > 0 ? (
                                    <ul>
                                        {results.map((client, index) => (
                                            <li
                                                key={client.id}
                                                className={index === selectedIndex ? 'selected' : ''}
                                            >
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
            {(!loading && clients) ?
                clients.length != 0 ?
                    <>
                        <p>Cantidad de clientes: {clients.length}</p>
                        <table cellSpacing={0}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Pagos pendientes</th>
                                    <th>tipo</th>
                                    <th>Correo</th>
                                    <th>Teléfono</th>
                                    <th>Dirección</th>
                                    <th>Opciones</th>
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