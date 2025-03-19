import { useEffect, useState } from "react";
import { api, urlStorage } from "../../../services/api";
import { Loading } from "../../Loading/Loading";
import { Pagination } from "../../Pagination/Pagination";
import { toast, ToastContainer } from 'react-toastify'
import './ProductList.css'
import { Modal } from "../../Modal/Modal";

export function ProductList({ orderId, setOrderProducts }) {
    const { Products, Order } = api;
    const products = new Products();

    const [page, setPage] = useState(1);
    const [dataPage, setDataPage] = useState(null);
    const [productList, setProductList] = useState(null);
    const [selected, setSelected] = useState(false);

    async function getProducts() {
        const options = {
            page,
            category: null,
            status: 'active',
        };

        setProductList(null);
        const dataPage = await products.search({ options });
        setDataPage(dataPage);
        setProductList(dataPage.data);

    }

    async function addProduct(e) {
        e.preventDefault()

        const orders = new Order()
        const formData = new FormData(e.target)

        const { thumbnails, id, name, price, providers } = selected

        console.log(selected)

        thumbnails && formData.append('picture', thumbnails)
        formData.append('purchase_price', providers.length != 0 ? providers[0].pivot.purchase_price : 0)
        formData.append('product_id', id)
        formData.append('order_id', orderId)
        formData.append('name', name)
        formData.append('price', price)

        try {
            const product = await orders.add(formData)

            setOrderProducts(current => [...current, product])

            setSelected(false)

        } catch (error) {
            toast.error(error)
        }
    }

    useEffect(() => {
        getProducts();
    }, [page]);

    return (
        <div>
            {dataPage ? (
                <>
                    <div className="list">
                        {productList ?
                            productList.length !== 0 &&
                            productList.map((product) => (
                                <div className="product" key={product.id} onClick={() => setSelected(product)}>
                                    <img src={`${urlStorage}/${JSON.parse(product.images)[0]}`} />
                                    <span>${parseFloat(product.price)}</span>
                                    <p>{product.name}</p>
                                </div>
                            ))
                            :
                            <Loading />
                        }
                    </div>
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
            {selected &&
                <Modal>
                    <section className="section-form container-children">
                        <form onSubmit={addProduct}>
                            <div className="header-form">
                                <h1>Agregar: {selected.name}</h1>
                                <p>Campos con <span>*</span> son obligatorios</p>
                            </div>
                            <div>
                                <div>
                                    <p>Cantidad <span>*</span></p>
                                    <input
                                        type="number"
                                        placeholder="Cantidad"
                                        className="input"
                                        name='quantity'
                                    />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p>Descuento</p>
                                    <input
                                        type="number"
                                        placeholder="En porcentaje"
                                        className="input"
                                        name='discount'
                                    />
                                </div>
                            </div>
                            <div className="actions-edit">
                                <button type="button" className="btn" onClick={() => setSelected(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-solid">Guardar</button>
                            </div>
                        </form>
                    </section>
                    <div className="background-modal" onClick={() => setSelected(false)}></div>
                </Modal>
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
                stacked
            />
        </div>
    )
}