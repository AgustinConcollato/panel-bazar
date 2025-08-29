import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { api } from '../../../services/api'
import { Loading } from '../../Loading/Loading'
import { OrderOptions } from '../../OrderOptions/OrderOptions'
import { OrderProduct } from '../OrderProduct/OrderProduct'
import { OrderSearch } from '../OrderSearch/OrderSearch'
import './AcceptedOrder.css'
import { AddExternalProduct } from '../AddExternalProduct/AddExternalProduct'
import { Modal } from '../../Modal/Modal'

export function AcceptedOrder({ order: orderData }) {

    const { Order } = api
    const order = new Order()

    const navigate = useNavigate()

    const [products, setProducts] = useState(null)
    const [data, setData] = useState(orderData)
    const [discount, setDiscount] = useState(orderData.discount || 0)
    const [modal, setModal] = useState(false)
    const [discountInput, setDiscountInput] = useState('')

    async function removeProductOrder(id) {

        setProducts([])

        try {
            const response = await order.remove({ orderId: orderData.id, productId: id })

            if (response) {
                setProducts(response.products)
            }

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

    async function addDiscount(e) {
        e.preventDefault()

        if (!discountInput || discountInput < 0 || discountInput > 100) {
            toast.error('El descuento debe estar entre 0 y 100%')
            return
        }

        try {
            const response = await toast.promise(order.updateDiscount({
                order_id: orderData.id,
                discount: parseFloat(discountInput)
            }), {
                pending: 'Actualizando descuento...',
                success: 'Descuento actualizado correctamente',
                error: 'Error al actualizar el descuento'
            })

            if (response) {
                setDiscount(parseFloat(discountInput))
                setData(prev => ({
                    ...prev,
                    discount: parseFloat(discountInput)
                }))
                setModal(false)
                setDiscountInput('')
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (orderData.status !== 'accepted') {
            navigate(`/pedido/${orderData.id}/${orderData.status}`)
        }

        setProducts(orderData.products)
    }, [])

    useEffect(() => {
        const total = products ? products.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.subtotal), 0) : 0

        setData(prev => ({
            ...prev,
            total_amount: total
        }))
    }, [products])

    return (
        <>
            <section className="order">
                <div className='order-info'>
                    <div className='order-header'>
                        <OrderSearch
                            orderId={orderData.id}
                            setOrderProducts={setProducts}
                            setOrderData={() => { }}
                        />
                        <AddExternalProduct
                            orderId={orderData.id}
                            setOrderProducts={setProducts}
                        />
                    </div>
                    <ul className='order-detail-list'>
                        {products ?
                            products.length > 0 ?
                                products.map((product, index) => (
                                    <OrderProduct
                                        key={index}
                                        product={product}
                                        orderId={orderData.id}
                                        setProducts={setProducts}
                                        setOrderData={setData}
                                        updateOrder={updateOrder}
                                        removeProductOrder={removeProductOrder}
                                    />
                                )) : <p>No hay productos</p>
                            : <Loading />
                        }
                    </ul>
                </div>
                {products &&
                    <div className='order-detail'>
                        <h3>Detalle del pedido</h3>
                        <div className="info-product">
                            <ul>
                                <li></li>
                                <li>Productos <b>{products.length ?? ''}</b></li>
                                <li>Unidades
                                    <b>
                                        {products.reduce(
                                            (accumulator, currentValue) => accumulator + parseInt(currentValue.quantity),
                                            0,
                                        )}
                                    </b>
                                </li>
                                <li>Subtotal <b>${data.total_amount.toLocaleString('es-AR', { maximumFractionDigits: 2 })}</b></li>
                            </ul>
                        </div>
                        <div className='info-product'>
                            <ul>
                                <li>Envio <b>{data.delivery ? '$' + parseFloat(data.delivery).toLocaleString('es-AR', { maximumFractionDigits: 2 }) : 'A coordinar'}</b></li>
                                <li>Recargo <b>${parseFloat(data.surcharge ?? 0).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</b></li>
                                <li>
                                    Descuento
                                    <div className='add-discount'>
                                        <b>{discount ?? 0}% / ${(data.total_amount - (data.total_amount * (1 - discount / 100))).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</b>
                                        <button onClick={() => setModal(true)}> Editar descuento </button>
                                    </div>
                                </li>
                                <li>Total <h3>${((parseFloat(data.total_amount) * (1 - discount / 100)) + parseFloat(data.delivery ?? 0) + parseFloat(data.surcharge ?? 0)).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</h3></li>
                            </ul>
                        </div>
                        <OrderOptions order={orderData} onAction={() => navigate('/pedidos/aceptados')} />
                    </div>
                }
            </section>
            {modal &&
                <Modal onClose={() => setModal(false)}>
                    <div className='section-form'>
                        <form onSubmit={addDiscount}>
                            <div className="header-form">
                                <h2>Agregar descuento al pedido</h2>
                            </div>
                            <div>
                                <div>
                                    <p>Descuento</p>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder='Descuento'
                                        value={discountInput}
                                        onChange={(e) => setDiscountInput(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <button type='submit' className='btn btn-solid'>Agregar</button>
                                <button onClick={() => setModal(false)} className='btn'>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </Modal>
            }
        </>
    )
}