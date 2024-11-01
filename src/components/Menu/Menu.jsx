import { useState } from "react";
import { Link } from "react-router-dom";
import './Menu.css'

export function Menu() {

    const [menu, setMenu] = useState(false)

    document.onclick = (e) => {
        !e.target.closest('.btn-menu') && setMenu(false)
    }

    return (
        <>
            <button className="btn btn-solid btn-menu" onClick={() => setMenu(!menu)}>
                + Agregar
                {menu && <div className="menu">
                    <Link to={'/agregar-producto'}>Nuevo producto</Link>
                    <Link to={'/agregar-cliente'}>Nuevo cliente</Link>
                </div>}
            </button>
        </>
    )
}