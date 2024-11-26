import { Link, useNavigate } from 'react-router-dom'
import './NavBar.css'
import { api } from 'api-services'

export function NavBar() {

    const navigate = useNavigate()

    async function logout() {

        const token = localStorage.getItem('authToken')

        const { Auth } = api
        const auth = new Auth()

        const response = await auth.logout(token)

        if (response) {
            localStorage.removeItem('authToken')
            navigate('/ingresar')
        }
    }

    return (
        <aside>
            <nav className='nav-bar'>
                <ul>
                    <li>
                        <Link to={'/panel'}>Inicio</Link>
                    </li>
                    <li>
                        <Link to={'/pedidos'}>Pedidos</Link>
                    </li>
                    <li>
                        <Link to={'/productos'}>Productos</Link>
                    </li>
                    <li>
                        <Link to={'/clientes'}>Clientes</Link>
                    </li>
                </ul>
            </nav>
            <button className='btn btn-thins' onClick={logout}>Cerrar sesión</button>
        </aside>
    )
}