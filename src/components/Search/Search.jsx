import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchInput } from "../SearchInput/SearchInput";
import './Search.css'
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function Search() {

    const navigate = useNavigate()
    const [reload, setReload] = useState(false)

    async function searchProduct(e) {
        e.preventDefault()
        navigate('buscador/' + e.target[0].value)

        setReload(true)
        setTimeout(() => setReload(false), 1)
    }

    return (
        !reload &&
        <form onSubmit={searchProduct} className="search">
            <label htmlFor="search">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </label>
            <SearchInput />
        </form>
    )
}