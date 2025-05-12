import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Modal } from "../../components/Modal/Modal"
import { Order } from "../../services/ordersService"
import './OrderOptions.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { usePlatform } from "../../hooks/usePlatform"

export function OrderOptions({ order: orderData, onAction }) {

    const order = new Order()

    const navigate = useNavigate()
    const mobile = usePlatform()

    const [modal, setModal] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [cancel, setCancel] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingShare, setLoadingShare] = useState(false)

    async function rejectOrder() {
        try {
            const response = await order.rejectOrder(orderData.id)

            if (response) {
                setModal(false)
                onAction(response)
            }

        } catch (error) {
            console.log(error)
        }
    }

    async function acceptOrder() {
        try {
            const response = await order.acceptOrder(orderData.id)

            if (response) {
                navigate(`/pedido/${response.id}/${response.status}`)
            }

        } catch (error) {
            console.log(error)
        }
    }

    async function cancelOrder() {
        try {
            const response = await order.delete(orderData.id)
            if (response) {
                onAction(response)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function confirmOrder() {
        try {
            const response = await order.complete(orderData.id)

            if (response.status == 'success') {
                navigate(`/pedido/${orderData.id}/completed`)
            }
        } catch (error) {
            console.log(error)
        }
    }


    async function downloadPDF() {
        try {
            setLoading(true)
            const blob = await order.downloadPDF(orderData.id)

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `Pedido de ${orderData.client_name}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error("Error al descargar el PDF", error);
        } finally {
            setLoading(false)
        }
    }

    async function shareOnWhatsApp() {
        try {
            setLoadingShare(true)
            const blob = await order.downloadPDF(orderData.id)
            const file = new File([blob], `Pedido de ${orderData.client_name}.pdf`, { type: 'application/pdf' })

            if (navigator.share) {
                await navigator.share({
                    files: [file],
                    title: `Pedido de ${orderData.client_name}`,
                    text: `Detalle del pedido de ${orderData.client_name}`
                })
            } else {
                // Fallback para navegadores que no soportan Web Share API
                const whatsappUrl = `https://wa.me/?text=Detalle del pedido de ${encodeURIComponent(orderData.client_name)}`
                window.open(whatsappUrl, '_blank')
            }
        } catch (error) {
            console.error("Error al compartir el PDF", error);
        } finally {
            setLoadingShare(false)
        }
    }

    useEffect(() => {
        const handleKeyUp = (e) => {
            if (e.keyCode == 27) {
                setConfirm(false)
                setCancel(false)
                setModal(false)
            }
        }

        document.addEventListener("keyup", handleKeyUp)

        return () => {
            document.removeEventListener("keyup", handleKeyUp)
        }
    }, [])

    if (orderData.status === 'pending') {
        return (
            <>
                <div className="order-options container-btn">
                    <button
                        className="btn btn-solid"
                        onClick={acceptOrder}
                    >
                        Aceptar pedido
                    </button>
                    <button
                        className="btn btn-error-regular"
                        onClick={() => setModal(true)}
                    >
                        Rechazar pedido
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

    if (orderData.status === 'completed') {
        return (
            <>
                <div className="order-options container-btn">
                    <button className="btn btn-solid" onClick={downloadPDF} disabled={loading}>
                        {loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Descargar detalle'}
                    </button>

                    {mobile &&
                        <button className="btn btn-regular" onClick={shareOnWhatsApp} disabled={loadingShare}>
                            {loadingShare ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Compartir en WhatsApp'}
                        </button>
                    }
                </div>
            </>
        )
    }

    if (orderData.status === 'accepted') {
        return (
            <div className="order-options container-btn">
                <button className="btn btn-solid" onClick={() => setConfirm(true)}>Confirmar pedido</button>
                <button className="btn" onClick={() => setCancel(true)}>Cancelar pedido</button>
                {(cancel || confirm) &&
                    <Modal>
                        {cancel &&
                            <div className="container-children cancel-order">
                                <h2>¿Cancelar el pedido?</h2>
                                <p>Al cancelar el pedido no se podrá recuperar la información</p>
                                <div className="container-btn">
                                    <button className="btn" onClick={() => setCancel(false)}>No</button>
                                    <button className="btn btn-error-regular" onClick={cancelOrder}>Si, cancelar</button>
                                </div>
                            </div>
                        }
                        {confirm &&
                            <div className="container-children cancel-order">
                                <h2>Confirmar pedido</h2>
                                <p>Al confirmar el pedido no se podrán agregar nuevos productos. Solo se podrá generar el detalle</p>
                                <div className="container-btn">
                                    <button className="btn" onClick={() => setConfirm(false)}>Cancelar</button>
                                    <button className="btn btn-solid" onClick={confirmOrder}>Confirmar</button>
                                </div>
                            </div>
                        }
                        <div className="background-modal"
                            onClick={() => {
                                setCancel(false)
                                setConfirm(false)
                            }
                            }>
                        </div>
                    </Modal >
                }
            </div>

        )
    }
}