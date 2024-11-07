import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { api, urlStorage } from "../../services/api"
import { Loading } from "../Loading/Loading"
import { SearchOrderProduct } from "../SearchOrderProduct/SearchOrderProduct"
import './Order.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faImage } from "@fortawesome/free-solid-svg-icons"
import { faImage as imageRegular } from "@fortawesome/free-regular-svg-icons"

export function Order() {

    const { Order } = api
    const { id } = useParams()
    const [orderData, setOrderData] = useState(null)
    const [orderProducts, setOrderProducts] = useState(null)
    const [images, setImages] = useState(false)

    async function getOrder(orderId) {
        const order = new Order()
        try {
            const response = await order.get(orderId)
            console.log(response)

            setOrderData(response)
            setOrderProducts(response.products)
        } catch (error) {
            console.log(error.message)
        }

    }

    function addProductOrder() {

    }

    function removeProductOrder() {

    }

    function updateOrder() {

    }

    useEffect(() => {
        getOrder(id)
    }, [id])

    if (!orderData) return <Loading />

    return (
        <section className="order">
            <div className="order-header">
                <div>
                    <div>
                        <h3>{orderData.client_name}</h3>
                        <p>Código del pedido: {orderData.id}</p>
                        <p>Total: ${orderProducts.reduce((a, value) => a + value.subtotal, 0)}</p>
                    </div>
                    <div className="container-btn">
                        <button className="btn btn-solid">Confirmar</button>
                        <button className="btn btn-regular">Generar detalle</button>
                        <button className="btn">Cancelar</button>
                    </div>
                </div>
                <div>
                    <SearchOrderProduct orderId={id} setOrderProducts={setOrderProducts} />
                    <button className="btn btn-thins btn-images" onClick={() => setImages(!images)}>
                        {images ?
                            <FontAwesomeIcon icon={faImage} /> :
                            <FontAwesomeIcon icon={imageRegular} />
                        }
                        <span>{images ? 'Ocultar fotos' : 'Mostrar fotos'}</span>
                    </button>
                </div>
            </div>
            {orderProducts ?
                orderProducts.length != 0 ?
                    <div>
                        <table cellSpacing={0} className="order-table">
                            <thead>
                                <tr>
                                    <td className="quantity-td">Cantidad</td>
                                    <td className="image-td"></td>
                                    <td className="name-td">Producto</td>
                                    <td className="price-td">p/unitario</td>
                                    <td className="subtotal-td">subtotal</td>
                                    <td className="options-td">Opciones</td>
                                </tr>
                            </thead>
                            <tbody>
                                {orderProducts.map(e =>
                                    <tr key={e.id}>
                                        <td>{e.quantity}</td>
                                        <td style={{height: '65px', width: '65px'}}>{images && <img loading='lazy' src={e.picture == '-' ? '' : `${urlStorage}/${JSON.parse(e.picture)[0]}`} />}</td>
                                        <td>{e.name}</td>
                                        <td>${e.price}</td>
                                        <td>${e.subtotal}</td>
                                        <td>
                                            <button className="btn">Editar</button>
                                            <button className="btn">Eliminar</button>
                                        </td>
                                    </tr>)}
                            </tbody>
                        </table>
                    </div> :
                    <div className="not-products">
                        <p>Todavia no hay productos en el pedido de "{orderData.client_name}" <span>Agregar el primero</span></p>
                        <SearchOrderProduct orderId={id} setOrderProducts={setOrderProducts} />
                    </div> :
                <Loading />
            }
        </section>
    )
}