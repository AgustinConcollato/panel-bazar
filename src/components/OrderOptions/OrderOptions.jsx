import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Modal } from "../../components/Modal/Modal"
import { Order } from "../../services/ordersService"
import './OrderOptions.css'

export function OrderOptions({ order, setOrders }) {

    const orders = new Order()
    const navigate = useNavigate()

    const [modal, setModal] = useState(false)

    async function rejectOrder() {
        try {
            const response = await orders.rejectOrder(order.id)

            if (response) {
                setModal(false)
                setOrders(response)
            }

        } catch (error) {
            console.log(error)
        }
    }

    async function acceptOrder() {
        try {
            const response = await orders.acceptOrder(order.id)

            if (response) {
                navigate(`/pedido/${order.id}/${response.status}`)
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="order-options container-btn">
                <button
                    className="btn btn-error-regular"
                    onClick={() => setModal(true)}
                >
                    Rechazar pedido
                </button>
                <button
                    className="btn btn-solid"
                    onClick={acceptOrder}
                >
                    Aceptar pedido
                </button>
            </div>
            {modal &&
                <Modal>
                    <div className="container-children">
                        <h2>¿Estás seguro que deseas rechazar el pedido?</h2>
                        <p>Una vez rechazado no podrás volver a aceptarlo</p>
                        <div className="container-btn">
                            <button
                                className="btn"
                                onClick={() => setModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn btn-error-solid"
                                onClick={rejectOrder}
                            >
                                Rechazar
                            </button>
                        </div>
                    </div>
                    <div className="background-modal" onClick={() => setModal(false)}></div>
                </Modal>
            }
        </>
    )
}