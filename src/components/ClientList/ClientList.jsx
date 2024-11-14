import './ClientList.css'

export function ClientList({clients}) {
    return (
        <div className='container-table-clients'>
            <table>
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map(e =>
                        <tr>
                            <td className='client-name'>{e.name}</td>
                            <td>nuevo pedido | eliminar | editar</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}