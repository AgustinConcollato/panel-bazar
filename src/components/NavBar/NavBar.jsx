import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { api } from '../../services/api'
import { ContainerTruck01Icon, DeliveryBox01Icon, Home09Icon, Task02Icon, UserGroupIcon } from 'hugeicons-react'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './NavBar.css'

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
                        <NavLink to={'/panel'}>
                            <Home09Icon
                                size={18}
                                color='#000'
                            />
                            Inicio
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/pedidos'}>
                            <Task02Icon
                                size={18}
                                color='#000'
                            />
                            Pedidos
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/productos'}>
                            <DeliveryBox01Icon
                                size={18}
                                color='#000'
                            />
                            Productos
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/clientes'}>
                            <UserGroupIcon
                                size={18}
                                color='#000'
                            />
                            Clientes
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/proveedores'}>
                            <ContainerTruck01Icon
                                size={18}
                                color='#000'
                            />
                            Proveedores
                        </NavLink>
                    </li>
                    {/* {!hidden && <li><button onClick={() => {
                        localStorage.removeItem('authToken')
                        window.location.href = '/'
                    }}>cerrar sesión forzada</button></li>} */}
                </ul>
            </nav>
            <button className='btn btn-thins' onClick={logout}>Cerrar sesión</button>
        </aside>
    )
}