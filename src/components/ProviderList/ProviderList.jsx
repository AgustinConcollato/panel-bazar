import { Link } from "react-router-dom"
import { Loading } from "../Loading/Loading"
import './ProviderList.css'

export function ProviderList({ providers }) {

    return (
        <>
            <h3 className="title">Proveedores</h3>
            <div className="provider-list">
                {providers ?
                    <table cellSpacing={0}>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Código</th>
                                <th>Contacto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {providers.map(e =>
                                <tr>
                                    <td>
                                        <Link to={`/proveedores/${e.id}`}>{e.name}</Link>
                                    </td>
                                    <td>{e.provider_code}</td>
                                    <td>
                                        {e.contact_info ? (
                                            (() => {
                                                const urlRegex = /^(https?:\/\/|www\.)[^\s]+$/;
                                                const isURL = urlRegex.test(e.contact_info);
                                                const formattedURL = e.contact_info.startsWith('http')
                                                    ? e.contact_info
                                                    : `https://${e.contact_info}`;

                                                return isURL ? (
                                                    <Link to={formattedURL} target="_blank" rel="noopener noreferrer">
                                                        {formattedURL}
                                                    </Link>
                                                ) : (
                                                    e.contact_info
                                                );
                                            })()
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                </tr>
                            )
                            }
                        </tbody>
                    </table>
                    : <Loading />
                }
            </div>
        </>
    )
}