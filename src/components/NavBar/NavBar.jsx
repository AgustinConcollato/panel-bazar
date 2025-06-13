import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { CalendarIcon, ClientIcon, HomeIcon, OrderIcon, ProductIcon, ProviderIcon, ShoppingBasketIcon, WalletIcon } from '../../icons/icons'
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

    const navItems = [
        {
            to: '/panel',
            icon: <HomeIcon width={18} height={18} color='#000' />,
            label: 'Inicio'
        },
        {
            to: '/pedidos',
            icon: <OrderIcon width={18} height={18} color='#000' />,
            label: 'Pedidos'
        },
        {
            to: '/productos',
            icon: <ProductIcon width={18} height={18} color='#000' />,
            label: 'Productos'
        },
        {
            to: '/clientes',
            icon: <ClientIcon width={18} height={18} color='#000' />,
            label: 'Clientes'
        },
        {
            to: '/proveedores',
            icon: <ProviderIcon width={18} height={18} color='#000' />,
            label: 'Proveedores'
        },
        {
            to: '/caja',
            icon: <WalletIcon width={18} height={18} color='#000' />,
            label: 'Caja'
        },
        {
            to: '/eventos',
            icon: <CalendarIcon width={18} height={18} color='#000' />,
            label: 'Eventos'
        },
        {
            to: '/compras',
            icon: <ShoppingBasketIcon width={18} height={18} color='#000' />,
            label: 'compras'
        }
    ]

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
                    {navItems.map(item => (
                        <li key={item.to}>
                            <NavLink to={item.to}>
                                {item.icon}
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div>
                <Link to={'https://www.bazarrshop.com'} target='_blank' className='btn'>Ver página <span>www.bazarrshop.com</span></Link>
                <button className='btn btn-thins' onClick={logout}>Cerrar sesión</button>
            </div>
        </aside>
    )
}