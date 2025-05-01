import { Link, useNavigate } from 'react-router-dom';
import { urlStorage } from '../../../services/api';
import { formatDate } from '../../../utils/formatDate';
import './PendingOrder.css';
import { OrderOptions } from '../../OrderOptions/OrderOptions';
import { useEffect } from 'react';

export function PendingOrder({ order, products }) {

    const navigate = useNavigate()

    useEffect(() => {
        if (order.status !== 'pending') {
            navigate(`/pedido/${order.id}/${order.status}`)
        }
    }, [])

    return (
        <div className="order-confirmed">
            {order ?
                <>
                    <Details order={order} />
                    <div className="container-order-product-table">
                        {products &&
                            <table className="order-product-table" cellSpacing={0}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, i) => (
                                        <tr className="order-product" key={product.product_id}>
                                            <td>{i + 1}</td>
                                            <td>
                                                <Link to={`/producto/${product.product_id}`}>
                                                    <img
                                                        src={urlStorage + '/' + JSON.parse(product.picture)[0]}
                                                        alt={product.name}
                                                        className="product-image"
                                                    />
                                                    {product.name}
                                                </Link>
                                            </td>
                                            <td>{product.quantity}</td>
                                            <td>{product.discount ?
                                                <>
                                                    <p className="discount">
                                                        <span>-{product.discount}%</span>
                                                        <p className="price">${parseFloat(product.price)}</p>
                                                    </p>
                                                    <p>${parseFloat(product.price - (product.discount * product.price) / 100)}</p>
                                                </> :
                                                <p>${parseFloat(product.price)}</p>
                                            }</td>
                                            <td>${parseFloat(product.subtotal)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        }
                    </div>
                </> :
                <Loading />}
        </div>
    )
}

function Details({ order }) {

    const address = JSON.parse(order.address);

    const navigate = useNavigate()

    return (
        <div className="order-details">
            <h2>Resumen del pedido</h2>
            <ul>
                <li>Código<b>{order.id}</b></li>
                <li>Fecha<b>{formatDate(order.created_at)}</b></li>
            </ul>
            {
                address.transport ?
                    <ul>
                        <li>Retirar
                            <Link
                                to={'https://www.google.com.ar/maps/place/Juan+Jos%C3%A9+Paso+1523,+S2300+Rafaela,+Santa+Fe/@-31.2664114,-61.5118381,70m/data=!3m1!1e3!4m6!3m5!1s0x95caae2af4108a65:0xfd97a1b7bba70429!8m2!3d-31.2663358!4d-61.511836!16s%2Fg%2F11l75_ggfg?hl=es&entry=ttu&g_ep=EgoyMDI1MDQyNy4xIKXMDSoASAFQAw%3D%3D'}
                                target='_blank'
                            >
                                <p>
                                    <b>Juan José Paso 1523</b>
                                    <span>Rafaela, Santa fe</span>
                                </p>
                            </Link>
                        </li>
                    </ul> :
                    < ul >
                        <li>Enviar
                            <p>
                                <b>{address.address} {address.address_number}</b>
                                <span>{address.city}, {address.province}</span>
                            </p>
                        </li>
                    </ul>
            }
            <ul>
                <li>Métodos de pago
                    <p>
                        {order.payments.map(e =>
                            <p className='method'>
                                <b>${e.expected_amount}</b>
                                {e.method == 'transfer' ? 'Transferencia' : e.method == 'cash' ? 'Efectivo' : 'Cheque'}
                            </p>
                        )}
                    </p>
                </li>
            </ul>
            <ul>
                <li>Cantidad de productos <b>{order.products.length}</b></li>
                <li>Cantidad de unidades
                    <b>
                        {order.products.reduce(
                            (accumulator, currentValue) => accumulator + currentValue.quantity,
                            0,
                        )}
                    </b>
                </li>
                {order.discount ? <li>Descuento <b>{order.discount}%</b></li> : null}
                {order.discount ?
                    <li>Precio
                        <p>
                            <span className="discount">
                                ${order.total_amount}
                            </span>
                            <b>${parseFloat(order.total_amount - (order.total_amount * order.discount) / 100)}</b>
                        </p>
                    </li> :
                    <li>Precio<b>${parseFloat(order.total_amount)}</b></li>
                }
            </ul>
            <OrderOptions order={order} setOrders={() => { navigate('/pedidos') }} />
        </div >
    )
}