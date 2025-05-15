import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ClientIcon, HomeIcon, OrderIcon, ProductIcon, ProviderIcon, WalletIcon } from '../../icons/icons'
import { api } from '../../services/api'
import './NavBar.css'

export function NavBar() {

    const [hidden, setHidden] = useState(true)

    async function logout() {

        const { Auth } = api
        const auth = new Auth()

        const response = await auth.logout()

        if (response) {
            localStorage.removeItem('authToken')
            window.location.href = '/ingresar'
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
                            <HomeIcon
                                width={18}
                                height={18}
                                color='#000'
                            />
                            Inicio
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/pedidos'}>
                            <OrderIcon
                                width={18}
                                height={18}
                                color='#000'
                            />
                            Pedidos
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/productos'}>
                            <ProductIcon
                                width={18}
                                height={18}
                                color='#000'
                            />
                            Productos
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/clientes'}>
                            <ClientIcon
                                width={18}
                                height={18}
                                color='#000'
                            />
                            Clientes
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/proveedores'}>
                            <ProviderIcon
                                width={18}
                                height={18}
                                color='#000'
                            />
                            Proveedores
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/caja'}>
                            <WalletIcon
                                width={18}
                                height={18}
                                color='#000'
                            />
                            Caja
                        </NavLink>
                    </li>
                    {/* {!hidden && <li><button onClick={() => {
                        localStorage.removeItem('authToken')
                        window.location.href = '/'
                    }}>cerrar sesión forzada</button></li>} */}
                </ul>
            </nav>
            <div>
                <Link to={'https://www.bazarrshop.com'} target='_blank' className='btn'>Ver página <span>www.bazarrshop.com</span></Link>
                <button className='btn btn-thins' onClick={logout}>Cerrar sesión</button>
            </div>
        </aside>
    )
}