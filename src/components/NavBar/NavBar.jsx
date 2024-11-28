import { Link, useNavigate } from 'react-router-dom'
import './NavBar.css'
import { api } from 'api-services'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'

export function NavBar() {

    const navigate = useNavigate()
    const [hidden, setHidden] = useState(true)

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
        <aside style={hidden ? { left: '-100%' } : { left: '0' }}>
            <div
                style={hidden ? { right: '-60px' } : { right: '20px' }}
                className='btn btn-navbar'
                onClick={() => setHidden(!hidden)}
            >
                <FontAwesomeIcon icon={hidden ? faBars : faXmark} />
            </div>
            <nav className='nav-bar'>
                <ul onClick={() => !hidden && setHidden(true)}>
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