import { Link } from 'react-router-dom'
import './NavBar.css'

export function NavBar() {
    return (
        <aside>
            <nav className='nav-bar'>
                <ul>
                    <li>
                        <Link to={'/'}>Inicio</Link>
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
        </aside>
    )
}