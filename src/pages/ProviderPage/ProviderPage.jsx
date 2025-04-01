import { useContext, useEffect, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { ProductsByProviderChart } from "../../components/ProductsByProviderChart/ProductsByProviderChart";
import { ProviderDetail } from "../../components/ProviderDetail/ProviderDetail";
import { ProviderList } from "../../components/ProviderList/ProviderList";
import { AppDataContext } from "../../context/AppDataContext";
import './ProviderPage.css';

export function ProviderPage() {

    const { providers } = useContext(AppDataContext)

    const [data, setData] = useState(null);

    useEffect(() => {
        if (providers) {
            const data = providers.map(provider => {
                const totalProducts = provider.products_count;
                return { value: totalProducts, name: provider.name };
            });
            setData(data);
        }

    }, [providers]);

    useEffect(() => {
        document.title = 'Proveedores'
    }, [])

    return (
        <section className="provider-page">
            <div className="header-provider-page">
                <Link to={'/agregar-proveedor'} className="btn btn-solid">+ Nuevo proveedor</Link>
            </div>
            <Routes>
                <Route path="/" element={
                    <>
                        <ProviderList providers={providers} />
                        <ProductsByProviderChart data={data} />
                    </>
                } />
                <Route path="/:id" element={<ProviderDetail />} />
                <Route path="*" element={<Navigate to="/panel" replace />} />
            </Routes>
        </section>
    )
}

