import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loading } from '../Loading/Loading';
import { Pagination } from '../Pagination/Pagination';
import { Product } from '../Product/Product';
import './ProductList.css';
import { api } from 'api-services';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function ProductList() {

    const { id } = useParams();
    const { Products } = api

    const products = new Products

    const [page, setPage] = useState(1)
    const [dataPage, setDataPage] = useState(null)
    const [productList, setProductList] = useState(null)

    async function getProducts(category) {
        const options = {
            page,
            category,
            panel: true
        }

        setProductList(null)

        const dataPage = await products.search({ options })

        setDataPage(dataPage)
        setProductList(dataPage.data)
    }

    async function updateProduct({ product, formData, hasChanges }) {
        if (hasChanges) {
            const { product: editedProduct } = await toast.promise(products.update({ id: product.id, data: formData }), {
                pending: 'Editando producto...',
                success: 'Se editó correctamente',
                error: 'Error, no se puedo editar'
            })

            return await editedProduct
        } else {
            toast.error('No hay cambios para guardar')
        }
    }

    useEffect(() => {
        getProducts(id)
    }, [id, page])

    useEffect(() => {
        setPage(1)
    }, [id])

    return (
        <section className='product-section'>
            {dataPage ? (
                <>
                    <table className='product-list' cellSpacing={0}>
                        <thead>
                            <tr>
                                <td>Foto</td>
                                <td>Producto</td>
                                <td>Estado</td>
                                <td></td>
                                <td>Precio</td>
                                <td>Opciones</td>
                            </tr>
                        </thead>
                        {productList && productList.length !== 0 ? (
                            <tbody>
                                {productList.map((product) => (
                                    <Product key={product.id} data={product} updateProduct={updateProduct} />
                                ))}
                            </tbody>
                        ) : (
                            <Loading />
                        )}
                    </table>
                    {dataPage.total > 0 && (
                        <Pagination
                            currentPage={dataPage.current_page}
                            lastPage={dataPage.last_page}
                            onPageChange={setPage}
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
                stacked />
        </section>
    )
}