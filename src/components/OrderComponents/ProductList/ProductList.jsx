import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { api, urlStorage } from "../../../services/api";
import { Loading } from "../../Loading/Loading";
import { Modal } from "../../Modal/Modal";
import { Pagination } from "../../Pagination/Pagination";
import './ProductList.css';

export function ProductList({ orderId, setOrderProducts, setOrderData }) {
    const { Products, Order } = api;
    const products = new Products();

    const [page, setPage] = useState(1);
    const [dataPage, setDataPage] = useState(null);
    const [productList, setProductList] = useState(null);
    const [selected, setSelected] = useState(false);
    const [name, setName] = useState(null);

    async function getProducts() {
        const options = {
            page,
            category: null,
            status: 'active',
            name
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

        const purchasePrice = () => {
            if (providers.length == 0) {
                return (price * 66) / 100;
            } else if (providers.length == 1) {
                return providers[0].pivot.purchase_price
            } else {
                const total = providers.reduce((a, provider) => a + parseFloat(provider.pivot.purchase_price), 0)
                return total / providers.length
            }
        }

        thumbnails && formData.append('picture', thumbnails)
        formData.append('purchase_price', purchasePrice())
        formData.append('product_id', id)
        formData.append('order_id', orderId)
        formData.append('name', name)
        formData.append('price', price)

        try {
            const product = await toast.promise(orders.add(formData), {
                pending: 'Agregando producto...',
                success: 'Se agregó correctamente',
            })

            setOrderProducts(current => [...current, product])

            setOrderData(current => ({
                ...current,
                total_amount: parseFloat(current.total_amount) + product.subtotal
            }));

            setSelected(false)

        } catch (error) {
            toast.error(error.error)
            if (error.errors) {
                return toast.error('Error, falta agregar la cantidad')
            }

        }
    }

    useEffect(() => {
        getProducts();
    }, [page, name]);

    useEffect(() => {
        const handleKeyUp = (e) => {
            if (e.keyCode == 27) {
                setSelected(false)
            }
        }

        document.addEventListener("keyup", handleKeyUp)

        return () => {
            document.removeEventListener("keyup", handleKeyUp)
        }
    }, [])

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="Buscar producto por nombre"
                    className="input"
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
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
                                <button type="submit" className="btn btn-solid">Agregar</button>
                                <button type="button" className="btn" onClick={() => setSelected(false)}>Cancelar</button>
                            </div>
                        </form>
                    </section>
                    <div className="background-modal" onClick={() => setSelected(false)}></div>
                </Modal>
            }
        </div>
    )
}