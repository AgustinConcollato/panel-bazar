import { useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Products } from "../../../services/productsService";
import { Loading } from "../../Loading/Loading";
import { Pagination } from "../../Pagination/Pagination";
import { ProductGrid } from "../ProductGrid/ProductGrid";
import "./ProductList.css";

export function ProductList({ productList, dataPage }) {

    const products = new Products();

    const [searchParams, setSearchParams] = useSearchParams();

    const handlePageChange = (newPage) => {
        const newParams = new URLSearchParams(searchParams);
        if (newPage !== 1) {
            newParams.set("page", newPage);
        } else {
            newParams.delete("page");
        }
        setSearchParams(newParams);
    };

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

    return (
        <section className="product-section">
            {dataPage ? (
                <>
                    <div className="container-product-grid">
                        {productList ?
                            productList.length !== 0 &&
                            productList.map((product) => (
                                <ProductGrid key={product.id} data={product} updateProduct={updateProduct} />
                            )) :
                            <Loading />
                        }
                    </div>
                    {productList &&
                        productList.length == 0 &&
                        <p>No se han encontrado porductos</p>
                    }
                    {dataPage.total > 0 && (
                        <Pagination
                            currentPage={parseInt(searchParams.get("page")) || 1}
                            lastPage={dataPage.last_page}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            ) : (
                <Loading />
            )}
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
                stacked
            />
        </section>
    );
}
