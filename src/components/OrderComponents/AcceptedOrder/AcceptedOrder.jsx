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

export function AcceptedOrder({ order: orderData }) {

    const { Order } = api
    const order = new Order()

    const navigate = useNavigate()

    const [products, setProducts] = useState(orderData.products)
    const [data, setData] = useState(orderData)
    const [discount, setDiscount] = useState(null)

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

    useEffect(() => {
        if (orderData.status !== 'accepted') {
            navigate(`/pedido/${orderData.id}/${orderData.status}`)
        }
    }, [])

    useEffect(() => {
        const total = products.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue.subtotal), 0)

        setData(prev => ({
            ...prev,
            total_amount: total
        }))
    }, [products])


    return (
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
                <div className='order-products'>
                    {products.length > 0 ?
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
                        )) : <Loading />
                    }
                </div>
            </div>
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
                        <li>Subtotal <b>$ {data.total_amount.toLocaleString('es-AR', { maximumFractionDigits: 2 })}</b></li>
                    </ul>
                </div>

                <div>
                    <ul className='order-detail-list'>
                        {products.map(e =>
                            <li>
                                <div>
                                    <span>{e.quantity}</span>
                                    <span className='name'>{e.name}</span>
                                </div>
                                <div>
                                    <p>${e.price.toLocaleString('es-AR', { maximumFractionDigits: 2 })}</p>
                                    <p>${e.subtotal.toLocaleString('es-AR', { maximumFractionDigits: 2 })}</p>
                                </div>
                            </li>)
                        }
                    </ul>
                </div>
                <div>
                    <p>Descuento {discount ?? <button>Agregar descuento</button>}</p>
                    <h2>${data.total_amount.toLocaleString('es-AR', { maximumFractionDigits: 2 })}</h2>
                </div>

                <OrderOptions order={orderData} onAction={() => navigate('/pedidos/aceptados')} />
            </div>
        </section >
    )
}