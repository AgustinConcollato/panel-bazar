import { Link, useParams, useSearchParams } from "react-router-dom";
import { Providers } from "../../services/providersService";
import { useEffect, useState } from "react";
import { ProductList } from "../ProductComponents/ProductList/ProductList";
import './ProviderDetail.css';
import { Loading } from "../Loading/Loading";

export function ProviderDetail() {

    const { id } = useParams()

    const providers = new Providers();

    const [searchParams, setSearchParams] = useSearchParams();

    const [dataPage, setDataPage] = useState(null);
    const [productList, setProductList] = useState(null);
    const [provider, setProvider] = useState(null);

    async function getProducts(providerId) {

        const options = {
            page: searchParams.get("page") || 1,
            providerId
        };

        setProductList(null);
        const dataPage = await providers.get(options)
        setDataPage(dataPage.products);
        setProductList(dataPage.products.data);
        setProvider(dataPage.provider);
    }

    useEffect(() => {
        id && getProducts(id);

    }, [id, searchParams]);

    useEffect(() => {
        document.title = provider ? 'Detalle de ' + provider.name : 'Detalle de ...'

    }, [provider]);

    return (
        <div className="provider-detail">
            {dataPage ?
                <>
                    <div className="header-provider-detail">
                        <div>
                            <h3 className="title">{provider?.name}</h3>
                            <p>Código: {provider?.provider_code}</p>
                            <p>Contacto: {provider?.contact_info ? (
                                (() => {
                                    const urlRegex = /^(https?:\/\/|www\.)[^\s]+$/;
                                    const isURL = urlRegex.test(provider.contact_info);
                                    const formattedURL = provider.contact_info.startsWith('http')
                                        ? provider.contact_info
                                        : `https://${provider.contact_info}`;

                                    return isURL ? (
                                        <Link to={formattedURL} target="_blank" rel="noopener noreferrer">
                                            {formattedURL}
                                        </Link>
                                    ) : (
                                        provider.contact_info
                                    );
                                })()
                            ) : (
                                '-'
                            )}
                            </p>
                            <p>Cantidad de prodcutos: {dataPage.total}</p>
                        </div>
                        <div>
                        </div>
                    </div>
                    <ProductList productList={productList} dataPage={dataPage} />
                </> :
                <Loading />
            }
        </div>
    )
}