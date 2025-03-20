import { api } from "../services/api"
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom"
import { Loading } from "../components/Loading/Loading";
import { Pagination } from "../components/Pagination/Pagination";
import { ProductGrid } from "../components/ProductComponents/ProductGrid/ProductGrid";
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

export function SearchResultsPage() {

    const { Products } = api
    const products = new Products()

    const { productName } = useParams()

    const [searchParams, setSearchParams] = useSearchParams()

    const [productList, setProductList] = useState(null)
    const [pageData, setPageData] = useState(null)


    async function getProducts() {

        try {
            const response = await products.search({
                options: {
                    name: productName,
                    page: searchParams.get("page") || 1,
                    panel: true
                }
            });

            setProductList(response.data)
            setPageData(response)
        } catch (error) {

        }
    }

    async function updateProduct({ product, formData, hasChanges }) {
        if (hasChanges) {
            const { product: editedProduct } = await toast.promise(
                products.update({ id: product.id, data: formData }),
                {
                    pending: "Editando producto...",
                    success: "Se editó correctamente",
                    error: "Error, no se pudo editar",
                }
            );

            return editedProduct;
        } else {
            toast.error("No hay cambios para guardar");
        }
    }

    const handlePageChange = (newPage) => {
        const newParams = new URLSearchParams(searchParams);
        if (newPage !== 1) {
            newParams.set("page", newPage);
        } else {
            newParams.delete("page");
        }
        setSearchParams(newParams);
    };


    useEffect(() => {
        setPageData(null)
        setProductList(null)
        getProducts()
        window.scrollTo(0, 0)
    }, [productName, searchParams])

    useEffect(() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", 1);

        document.title = `Resultados de "${productName}" - Bazarshop`
    }, [productName])

    return (
        <>
            <h1 style={{ fontWeight: '500', fontSize: '20px', marginBottom: '20px' }}>Resultados de "{productName}"</h1>
            {productList ?
                productList.length != 0 ?
                    <>
                        <section className="container-product-grid">
                            <>
                                {productList.map(product => (
                                    <ProductGrid data={product} updateProduct={updateProduct} />
                                ))}
                            </>
                        </section>
                        < Pagination
                            currentPage={parseInt(searchParams.get("page")) || 1}
                            lastPage={pageData.last_page}
                            onPageChange={handlePageChange}
                        />
                    </>
                    : <p>No se encontraron resultados</p>
                : <Loading />
            }
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition:Bounce
                stacked />
        </>
    )
}