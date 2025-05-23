import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { urlStorage } from '../../../services/api';
import { OrderDetail } from '../OrderDetail/OrderDetail';
import './OrderPending.css';

export function OrderPending({ order }) {

    const products = order.products

    const navigate = useNavigate()

    useEffect(() => {
        document.title = `Pedido pendiente de ${order.client_name}`

        if (order.status !== 'pending') {
            navigate(`/pedido/${order.id}/${order.status}`)
        }
    }, [order])

    return (
        <div className="order-confirmed">
            {order ?
                <>
                    <OrderDetail order={order} />
                    <div className="container-order-product-table">
                        {products &&
                            <table className="order-product-table" cellSpacing={0}>
                                <thead>
                                    <tr>
                                        <th>Cantidad</th>
                                        <th>Producto</th>
                                        <th>Precio</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, i) => (
                                        <tr key={product.product_id}>
                                            <td>{product.quantity}</td>
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
                                            <td>{product.discount ?
                                                <>
                                                    <p className="discount">
                                                        <span>-{product.discount}%</span>
                                                        <p className="price">${parseFloat(product.price).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</p>
                                                    </p>
                                                    <p>${parseFloat(product.price - (product.discount * product.price) / 100).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</p>
                                                </> :
                                                <p>${parseFloat(product.price).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</p>
                                            }</td>
                                            <td>${parseFloat(product.subtotal).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</td>
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