import { Link, Route, Routes } from "react-router-dom";
import { CategoryList } from "../components/CategoryList/CategoryList";
import { ProductList } from "../components/ProductList/ProductList";

export function ProductsPage() {
    return (
        <>
            <div className="header-products-page">
                <CategoryList />
                <Link className="btn btn-solid" to={'/agregar-producto'}>Agregar nuevo producto</Link>
            </div>
            <Routes>
                <Route path="/" element={<p className="select-category">Acá se ven tus productos <br />Selecciona una de las categorias</p>} />
                <Route path="/:id" element={<ProductList />} />
            </Routes>
        </>
    )
}