import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { TableIcon } from "hugeicons-react"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import { usePlatform } from "../../../hooks/usePlatform"
import { api, url } from "../../../services/api"
import { Loading } from "../../Loading/Loading"
import { Modal } from "../../Modal/Modal"
import { OrderProduct } from "../OrderProduct/OrderProduct"
import { ProductList } from "../ProductList/ProductList"
import './Order.css'
import { AssembleOrder } from "../AssembleOrder/AssembleOrder"

export function Order() {

    const { Order } = api
    const { id } = useParams()
    const mobile = usePlatform()

    const [orderData, setOrderData] = useState(null)
    const [orderProducts, setOrderProducts] = useState(null)
    const [remit, setRemit] = useState(null)
    const [loadingRemit, setLoadingRemit] = useState(false)
    const [cancel, setCancel] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [table, setTable] = useState(false)

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

            setOrderData(currentOrder => ({
                ...currentOrder,
                total_amount: currentOrder.products.reduce((total, p) =>
                    p.product_id === response.product_id
                        ? total + parseFloat(response.subtotal)
                        : total + parseFloat(p.subtotal),
                    0
                )
            }))

            return await response
        } else {
            toast.error('No hay cambios para hacer')
        }
    }

    async function downloadPDF() {
        try {
            const response = await fetch(`${url}/order/pdf/${orderData.id}?date=${new Date().getTime()}`);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `Pedido de ${orderData.client_name}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error al descargar el PDF", error);
        }
    }

    useEffect(() => {
        getOrder(id)
    }, [id])

    useEffect(() => {
        const handleKeyUp = (e) => {
            if (e.keyCode == 27) {
                setConfirm(false)
                setCancel(false)
                setTable(false)
            }
        }

        document.addEventListener("keyup", handleKeyUp)

        return () => {
            document.removeEventListener("keyup", handleKeyUp)
        }
    }, [])

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
                        {orderData.status == 'completed' && <button className="btn btn-regular" onClick={() => { setTable(true) }}><TableIcon /></button>}
                        {(orderData.status == 'accepted' && orderProducts?.length != 0) &&
                            <>
                                <button className="btn btn-regular" onClick={() => { setTable(true) }}><TableIcon /></button>
                                <button className="btn btn-solid" onClick={() => { setConfirm(true) }}>Confirmar pedido</button>
                            </>
                        }
                        {mobile ?
                            <button className="btn btn-regular" onClick={downloadPDF}>Descargar detalle</button> :
                            <button className="btn btn-regular" onClick={generateRemit}>{loadingRemit ? <Loading /> : 'Generar detalle'}</button>
                        }
                        {orderData.status == 'accepted' && <button className="btn" onClick={() => setCancel(true)}>Cancelar</button>}
                    </div>
                </div>

                {orderData.status == 'completed' ?
                    <table>
                        <thead>
                            <tr>
                                <th>Cantidad</th>
                                <th>Producto</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderProducts.map((e, i) =>
                                <AssembleOrder
                                    product={e}
                                    key={i}
                                />
                            )}
                        </tbody>
                    </table>
                    :
                    <ProductList
                        orderId={orderData.id}
                        setOrderProducts={setOrderProducts}
                        setOrderData={setOrderData}
                    />
                }
                {(remit && !mobile) &&
                    <div className="remit">
                        <div>
                            <button onClick={() => setRemit(null)} className="btn"><FontAwesomeIcon icon={faXmark} /></button>
                        </div>
                        <iframe src={remit} frameBorder="0"></iframe> :
                    </div>
                }
            </section >
            {(cancel || confirm || table) &&
                <Modal>
                    {cancel &&
                        <div className="container-children cancel-order">
                            <h2>¿Cancelar el pedido?</h2>
                            <p>Al cancelar el pedido no se podrá recuperar la información</p>
                            <div className="container-btn">
                                <button className="btn " onClick={() => setCancel(false)}>No</button>
                                <button className="btn btn-error-regular" onClick={cancelOrder}>Si, cancelar</button>
                            </div>
                        </div>
                    }
                    {confirm &&
                        <div className="container-children cancel-order">
                            <h2>Confirmar pedido</h2>
                            <p>Al confirmar el pedido no se podrán agregar nuevos productos. Solo se podrá generar el detalle</p>
                            <div className="container-btn">
                                <button className="btn " onClick={() => setConfirm(false)}>Cancelar</button>
                                <button className="btn btn-solid" onClick={confirmOrder}>Confirmar</button>
                            </div>
                        </div>
                    }
                    {table &&
                        <div className="container-order-table">
                            <div className="close-table" onClick={() => setTable(false)} >
                                <FontAwesomeIcon icon={faXmark} />
                            </div>
                            {orderProducts ?
                                orderProducts.length != 0 &&
                                <div className="order-table">
                                    <table cellSpacing={0}>
                                        <thead>
                                            <tr>
                                                <td>Cantidad</td>
                                                <td></td>
                                                <td>Producto</td>
                                                <td>p/unitario</td>
                                                <td>Desc.</td>
                                                <td>subtotal</td>
                                                {orderData.status == 'accepted' && <td>Opciones</td>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderProducts.map((e, i) =>
                                                <OrderProduct
                                                    product={e}
                                                    key={i}
                                                    setOrderProducts={setOrderProducts}
                                                    setOrderData={setOrderData}
                                                    orderId={orderData.id}
                                                    orderStatus={orderData.status}
                                                    updateOrder={updateOrder}
                                                />
                                            )}
                                        </tbody>
                                    </table>
                                </div> :
                                <Loading />
                            }
                        </div>
                    }
                    <div className="background-modal"
                        onClick={() => {
                            setCancel(false)
                            setTable(false)
                            setConfirm(false)
                        }
                        }>
                    </div>
                </Modal >
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
                stacked />
        </>
    )
}