import { ContainerTruck01Icon, DropboxIcon, UserAdd02Icon } from 'hugeicons-react';
import { Link } from 'react-router-dom';
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
                        <DropboxIcon
                            size={24}
                            color={"#000"}
                            variant={"stroke"}
                        />
                    </div>
                    <p>Cargar producto</p>
                </Link>
                <Link to={'/agregar-cliente'}>
                    <div className='shortcut-icon'>
                        <UserAdd02Icon
                            size={24}
                            color={"#000"}
                            variant={"stroke"}
                        />
                    </div>
                    <p>Nuevo cliente</p>
                </Link>
                <Link to={'/agregar-proveedor'}>
                    <div className='shortcut-icon'>
                        <ContainerTruck01Icon
                            size={24}
                            color={"#000"}
                            variant={"stroke"}
                        />
                    </div>
                    <p>Agregar proveedor</p>
                </Link>
            </div>
        </>

    )
}