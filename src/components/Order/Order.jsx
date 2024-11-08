import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { api, urlStorage } from "../../services/api"
import { Loading } from "../Loading/Loading"
import { Modal } from "../Modal/Modal"
import { SearchOrderProduct } from "../SearchOrderProduct/SearchOrderProduct"
import './Order.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faImage } from "@fortawesome/free-solid-svg-icons"
import { faImage as imageRegular } from "@fortawesome/free-regular-svg-icons"
import notImage from '../../assets/img/not-image-min.jpg'

export function Order() {

    const { Order } = api
    const { id } = useParams()
    const [orderData, setOrderData] = useState(null)
    const [orderProducts, setOrderProducts] = useState(null)
    const [images, setImages] = useState(false)
    const [modal, setModal] = useState(false)
    const [remove, setRemove] = useState(false)
    const [edit, setEdit] = useState(false)

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

    function removeProductOrder(id) {
        const order = new Order()

        order.remove({ orderId: orderData.id, productId: id })
        setModal(true)
        setRemove(true)

    }

    function editOrder() {
        setModal(true)
        setEdit(true)
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
                            <button className="btn btn-solid">Confirmar</button>
                            <button className="btn btn-regular">Generar detalle</button>
                            <button className="btn">Cancelar</button>
                        </div>
                    </div>
                   {orderProducts.length != 0 && <div>
                        <SearchOrderProduct orderId={id} setOrderProducts={setOrderProducts} />
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
                        <div>
                            <table cellSpacing={0} className="order-table">
                                <thead>
                                    <tr>
                                        <td>Cantidad</td>
                                        <td></td>
                                        <td>Producto</td>
                                        <td>p/unitario</td>
                                        <td>subtotal</td>
                                        <td>Opciones</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderProducts.map(e =>
                                        <tr key={e.productId}>
                                            <td className="quantity-td" >{e.quantity}</td>
                                            <td className="image-td" style={{ height: '65px', width: '65px' }}>{images && <img loading='lazy' src={e.picture == '-' ? notImage : `${urlStorage}/${JSON.parse(e.picture)[0]}`} />}</td>
                                            <td className="name-td" >{e.name}</td>
                                            <td className="price-td" >${e.price}</td>
                                            <td className="subtotal-td" >${e.subtotal}</td>
                                            <td className="options-td" >
                                                <div>
                                                    <button className="btn" onClick={editOrder}>Editar</button>
                                                    <button className="btn btn-error-regular" onClick={() => removeProductOrder(e.product_id)}>Eliminar</button>
                                                </div>
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
            {modal &&
                <Modal>
                    {remove && <div>eliminar</div>}
                    {edit && <div>editar</div>}
                    <div className="background-modal" onClick={() => {
                        setEdit(false)
                        setRemove(false)
                        setModal(false)
                    }
                    }></div>
                </Modal>
            }
        </>
    )
}