import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "api-services";
import { Loading } from "../Loading/Loading";
import './CategoryList.css';

export function CategoryList() {

    const { Categories } = api
    const [list, setList] = useState([])

    const categories = new Categories()

    async function getCategories() {
        setList(await categories.get({}))
    }

    useEffect(() => {
        getCategories()
    }, [])

    return (
        <nav className='nav-categories'>
            {list.length !== 0 ?
                <ul>
                    {list.map((e) =>
                        <li key={e.category_code}>
                            <Link to={`/productos/${e.category_code}`}>
                                {e.category_name}
                                <span>{e.products_count} productos</span>
                            </Link>
                        </li>
                    )}
                </ul> :
                <Loading />
            }
        </nav>
    )
}