import { Link } from "react-router-dom";
import { ProductFilters } from "../../components/ProductComponents/ProductFilters/ProductFilters";
import { ProductList } from "../../components/ProductComponents/ProductList/ProductList";
import './ProductsPage.css';
import { useEffect } from "react";

export function ProductsPage() {

    useEffect(() => {
        document.title = 'Lista de productos'
    }, [])

    return (
        <section className="products-page">
            <div className="header-products-page">
                <ProductFilters />
                <Link to={'/agregar-producto'} className="btn btn-solid">+ Nuevo producto </Link>
            </div>
            <ProductList />
        </section>
    )
}