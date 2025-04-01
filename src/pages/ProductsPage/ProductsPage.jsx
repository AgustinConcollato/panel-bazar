import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ProductFilters } from "../../components/ProductComponents/ProductFilters/ProductFilters";
import { ProductList } from "../../components/ProductComponents/ProductList/ProductList";
import { Products } from "../../services/productsService";
import './ProductsPage.css';

export function ProductsPage() {

    const products = new Products();

    const [searchParams, setSearchParams] = useSearchParams();

    const [dataPage, setDataPage] = useState(null);
    const [productList, setProductList] = useState(null);

    async function getProducts() {
        const options = {
            page: searchParams.get("page") || 1,
            category: searchParams.get("category") || null,
            price: searchParams.get("price") || null,
            status: searchParams.get("status") || null,
            panel: true,
        };

        setProductList(null);
        const dataPage = await products.search({ options });
        setDataPage(dataPage);
        setProductList(dataPage.data);

    }

    useEffect(() => {
        getProducts();

        document.title = 'Lista de productos'

    }, [searchParams]);

    return (
        <section className="products-page">
            <div className="header-products-page">
                <ProductFilters />
                <Link to={'/agregar-producto'} className="btn btn-solid">+ Nuevo producto </Link>
            </div>
            <ProductList productList={productList} dataPage={dataPage} />
        </section>
    )
}