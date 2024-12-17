import { faImage as imageRegular } from "@fortawesome/free-regular-svg-icons"
import { faImage, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "api-services"
import { Loading } from "../Loading/Loading"
import { OrderProduct } from "../OrderProduct/OrderProduct"
import { SearchOrderProduct } from "../SearchOrderProduct/SearchOrderProduct"
import './Order.css'
import { toast, ToastContainer } from 'react-toastify'

export function Order() {

    const { Order } = api
    const { id } = useParams()
    const [orderData, setOrderData] = useState(null)
    const [orderProducts, setOrderProducts] = useState(null)
    const [images, setImages] = useState(false)
    const [remit, setRemit] = useState(null)
    const [loadingRemit, setLoadingRemit] = useState(false)

    const navigate = useNavigate()
    const order = new Order()

    async function getOrder(orderId) {
        try {
            const response = await order.get(orderId)

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
                        <div>
                            <h3>{orderData.client_name}</h3>
                            <p>Código del pedido: {orderData.id}</p>
                        </div>
                        <div className="container-btn">
                            {orderProducts.length != 0 &&
                                <>
                                    {orderData.status == 'pending' && <button className="btn btn-solid" onClick={confirmOrder}>Confirmar</button>}
                                    <button className="btn btn-regular" onClick={generateRemit}>{loadingRemit ? <Loading /> : 'Generar detalle'}</button>
                                </>
                            }
                            {orderData.status == 'pending' && <button className="btn" onClick={cancelOrder}>Cancelar</button>}
                        </div>
                    </div>
                    {orderProducts.length != 0 &&
                        <div>
                            {orderData.status == 'pending' ? < SearchOrderProduct orderId={id} setOrderProducts={setOrderProducts} /> : <div> </div>}
                            <button className="btn btn-thins btn-images" onClick={() => setImages(!images)}>
                                {images ?
                                    <FontAwesomeIcon icon={faImage} /> :
                                    <FontAwesomeIcon icon={imageRegular} />
                                }
                                <span>{images ? 'Ocultar fotos' : 'Mostrar fotos'}</span>
                            </button>
                        </div>}
                </div>
                {orderProducts ?
                    orderProducts.length != 0 ?
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
                                            images={images}
                                            setOrderProducts={setOrderProducts}
                                            orderId={orderData.id}
                                            orderStatus={orderData.status}
                                            updateOrder={updateOrder}
                                        />
                                    )}
                                </tbody>
                            </table>
                        </div> :
                        <div className="not-products">
                            <p>Todavia no hay productos en el pedido de "{orderData.client_name}" <span>Agregar el primero</span></p>
                            <SearchOrderProduct orderId={id} setOrderProducts={setOrderProducts} />
                        </div> :
                    <Loading />
                }
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