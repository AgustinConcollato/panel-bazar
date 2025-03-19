import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import { api } from "../../../services/api"
import { Loading } from "../../Loading/Loading"
import { ProductList } from "../ProductList/ProductList"
import { OrderProduct } from "../OrderProduct/OrderProduct"
import { OrderProductSearch } from "../OrderProductSearch/OrderProductSearch"
import './Order.css'

export function Order() {

    const { Order } = api
    const { id } = useParams()
    const [orderData, setOrderData] = useState(null)
    const [orderProducts, setOrderProducts] = useState(null)
    const [remit, setRemit] = useState(null)
    const [loadingRemit, setLoadingRemit] = useState(false)

    const navigate = useNavigate()
    const order = new Order()

    async function getOrder(orderId) {
        try {
            const response = await order.get(orderId)

            document.title = `Pedido de ${response.client_name}`
            setOrderData(response)
            setOrderProducts(response.products)
        } catch (error) {
            console.log(error.message)
        }

    }

    async function cancelOrder() {
        try {
            const response = await order.delete(orderData.id)

            if (response.status == 'success') {
                navigate('/pedidos')
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function confirmOrder() {
        try {
            const response = await order.complete(orderData.id)

            if (response.status == 'success') {
                navigate('/pedidos')
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function generateRemit() {
        setLoadingRemit(true)
        try {
            setRemit(await order.remit(orderData))
            setLoadingRemit(false)
        } catch (error) {
            console.log(error)
        }
    }

    async function updateOrder({ hasChanges, formData }) {
        if (hasChanges) {
            const response = await toast.promise(order.update(formData), {
                pending: 'Editando producto...',
                success: 'Se editó correctamente',
                error: 'Error, no se puedo editar'
            })

            return await response
        } else {
            toast.error('No hay cambios para hacer')
        }
    }

    useEffect(() => {
        getOrder(id)
    }, [id])

    if (!orderData) return <Loading />

    return (
        <>
            <section className="order">
                <div className="order-header">
                    <div>
                        <h3>{orderData.client_name}</h3>
                        <p>Precio total: ${orderData.total_amount}</p>
                    </div>
                    <div className="container-btn">
                        <button className="btn btn-regular" onClick={generateRemit}>{loadingRemit ? <Loading /> : 'Generar detalle'}</button>
                        {orderData.status == 'pending' && <button className="btn" onClick={cancelOrder}>Cancelar</button>}
                    </div>
                </div>
                <div>
                    <OrderProductSearch orderId={id} setOrderProducts={setOrderProducts} />
                </div>
                <div className="container-product-list">
                    <ProductList orderId={orderData.id} setOrderProducts={setOrderProducts} />
                    {orderProducts ?
                        orderProducts.length != 0 &&
                        <div className="container-order-table">
                            <table cellSpacing={0} className="order-table">
                                <thead>
                                    <tr>
                                        <td>Cantidad</td>
                                        <td></td>
                                        <td>Producto</td>
                                        <td>p/unitario</td>
                                        <td>Desc.</td>
                                        <td>subtotal</td>
                                        {orderData.status == 'pending' && <td>Opciones</td>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderProducts.map((e, i) =>
                                        <OrderProduct
                                            product={e}
                                            key={i}
                                            setOrderProducts={setOrderProducts}
                                            orderId={orderData.id}
                                            orderStatus={orderData.status}
                                            updateOrder={updateOrder}
                                        />
                                    )}
                                </tbody>
                            </table>
                            <div className="container-btn">
                                {orderProducts.length != 0 &&
                                    <>
                                        {orderData.status == 'pending' && <button className="btn btn-solid" onClick={confirmOrder}>Confirmar</button>}
                                    </>
                                }
                            </div>
                        </div> :
                        <Loading />
                    }
                </div>
                {remit &&
                    <div className="remit">
                        <div>
                            <button onClick={() => setRemit(null)} className="btn"><FontAwesomeIcon icon={faXmark} /></button>
                        </div>
                        <iframe src={remit} frameBorder="0"></iframe>
                    </div>
                }
            </section>
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