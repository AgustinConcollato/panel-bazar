import { useState } from "react";
import { Modal } from "../../Modal/Modal";
import './AddExternalProduct.css'
import { Order } from "../../../services/ordersService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export function AddExternalProduct({ orderId, setOrderProducts }) {

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    function generateUUIDv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    async function addExternalProduct(e) {
        e.preventDefault()

        const order = new Order()

        const formData = new FormData(e.target)

        formData.append('order_id', orderId)
        formData.append('product_id', generateUUIDv4())
        formData.append('subtotal', formData.get('price') * formData.get('quantity'))

        if (!formData.get('purchase_price')) {
            formData.append('purchase_price', (formData.get('price') * 66) / 100)
        }

        try {
            setIsLoading(true)
            const product = await toast.promise(order.add(formData), {
                pending: 'Agregando producto...',
                success: 'Se agregó correctamente',
            })

            setOrderProducts(current => [...current, product])

            setIsOpen(false)

        } catch (error) {
            if (error.errors.name) {
                toast.error('Error, falta agregar el nombre del producto')
            }
            if (error.errors.price) {
                toast.error('Error, falta agregar el precio de venta')
            }
            if (error.errors.quantity) {
                toast.error('Error, falta agregar la cantidad')
            }

        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <button className='btn btn-add-external-product' onClick={() => setIsOpen(true)}>Cargar producto externo</button>
            {isOpen &&
                <Modal onClose={() => setIsOpen(false)}>
                    <div className="section-form">
                        <h2 className="title-modal-enternal">Cargar producto externo</h2>
                        <div>
                            <form onSubmit={addExternalProduct}>
                                <div>
                                    <div>
                                        <p>Nombre del producto</p>
                                        <input type="text" name="name" className="input" placeholder="Nombre del producto" />
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <p>Cantidad</p>
                                        <input type="text" name="quantity" className="input" placeholder="Cantidad" />
                                    </div>
                                </div>
                                <div>
                                    <h3>Precios</h3>
                                    <div>
                                        <p>Precio de venta</p>
                                        <input type="number " name="price" className="input" placeholder="Precio de venta" />
                                    </div>
                                    <div>
                                        <p>Precio de compra</p>
                                        <input type="number" name="purchase_price" className="input" placeholder="Precio de compra" />
                                    </div>
                                    <div>
                                        <p>Descuento</p>
                                        <input type="number" name="discount" className="input" placeholder="Descuento" />
                                    </div>
                                </div>
                                <div>
                                    <button className="btn btn-solid" disabled={isLoading}>
                                        {isLoading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Agregar producto'}
                                    </button>
                                    <button className="btn" onClick={() => setIsOpen(false)}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal>
            }
        </>
    )
}