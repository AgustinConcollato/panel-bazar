import { Link } from 'react-router-dom';
import { AddClientIcon, AddProductIcon, ProviderIcon } from '../../icons/icons';
import './Shortcuts.css';

export function Shortcuts() {
    return (
        <>
            <div className='shortcuts'>
                {/* <Link to={'/'}>
                    <div className='shortcut-icon'>
                        <Task02Icon
                            size={24}
                            color={"#000"}
                            variant={"stroke"}
                        />
                    </div>
                    <p>Crear nuevo pedido</p>
                </Link> */}
                <Link to={'/agregar-producto'}>
                    <div className='shortcut-icon'>
                        <AddProductIcon
                            width={24}
                            height={24}
                            color={"#000"}
                        />
                    </div>
                    <p>Cargar producto</p>
                </Link>
                <Link to={'/agregar-cliente'}>
                    <div className='shortcut-icon'>
                        <AddClientIcon
                            width={24}
                            height={24}
                            color={"#000"}
                        />
                    </div>
                    <p>Nuevo cliente</p>
                </Link>
                <Link to={'/agregar-proveedor'}>
                    <div className='shortcut-icon'>
                        <ProviderIcon
                            width={24}
                            height={24}
                            color={"#000"}
                        />
                    </div>
                    <p>Agregar proveedor</p>
                </Link>
            </div>
        </>

    )
}