import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Loading } from '../Loading/Loading';
import { Pagination } from '../Pagination/Pagination';
import { Product } from '../Product/Product';
import './ProductList.css';

export function ProductList() {

    const { id } = useParams();
    const { products } = api

    const [page, setPage] = useState(1)
    const [dataPage, setDataPage] = useState(null)
    const [productList, setProductList] = useState(null)

    async function getProducts(category) {
        const options = {
            page,
            category
        }

        setProductList(null)

        const dataPage = await products.search({ options })

        setDataPage(dataPage)
        setProductList(dataPage.data)
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
                                <td>#</td>
                                <td>Producto</td>
                                <td></td>
                                <td>Precio</td>
                                <td>Opciones</td>
                            </tr>
                        </thead>
                        {productList && productList.length !== 0 ? (
                            <tbody>
                                {productList.map((product) => (
                                    <Product key={product.id} data={product} />
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
        </section>
    )
}