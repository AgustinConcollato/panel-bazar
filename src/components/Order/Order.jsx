import { faImage as imageRegular } from "@fortawesome/free-regular-svg-icons"
import { faImage, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api, urlOrder } from "../../services/api"
import { Loading } from "../Loading/Loading"
import { OrderProduct } from "../OrderProduct/OrderProduct"
import { SearchOrderProduct } from "../SearchOrderProduct/SearchOrderProduct"
import './Order.css'

export function Order() {

    const { Order } = api
    const { id } = useParams()
    const [orderData, setOrderData] = useState(null)
    const [orderProducts, setOrderProducts] = useState(null)
    const [images, setImages] = useState(false)
    const [remit, setRemit] = useState(null)

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

    function generateRemit() {
        let date

        if (orderData.status == 'pending') {
            date = new Date().getTime()
        } else {
            date = orderData.date
        }

        setRemit({ id: orderData.id, date })
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
                            <p>Total: ${orderProducts.reduce((a, value) => a + value.subtotal, 0)}</p>
                        </div>
                        <div className="container-btn">
                            {orderProducts.length != 0 &&
                                <>
                                    {orderData.status == 'pending' && <button className="btn btn-solid" onClick={confirmOrder}>Confirmar</button>}
                                    <button className="btn btn-regular" onClick={generateRemit}>Generar detalle</button>
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
                                        <td>subtotal</td>
                                        {orderData.status == 'pending' && <td>Opciones</td>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderProducts.map((e, i) =>
                                        <OrderProduct
                                            e={e}
                                            key={i}
                                            images={images}
                                            setOrderProducts={setOrderProducts}
                                            orderData={orderData}
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
                {remit != null &&
                    <div className="remit">
                        <div>
                            <button onClick={() => setRemit(null)} className="btn"><FontAwesomeIcon icon={faXmark} /></button>
                        </div>
                        <iframe src={`${urlOrder}/pdf/${remit.id}?date=${remit.date}`} frameBorder="0"></iframe>
                    </div>
                }
            </section>
        </>
    )
}