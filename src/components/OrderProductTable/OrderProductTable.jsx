import { Link } from "react-router-dom";
import { urlStorage } from "../../services/api";
import notImage from '../../assets/img/not-image-min.jpg'

export function OrderProductTable({ order }) {
    return (
        <div className="container-order-product-table">
            {order.products &&
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
                        {order.products.map((product, i) => (
                            <tr key={product.product_id}>
                                <td>{product.quantity}</td>
                                <td>
                                    <Link to={`/producto/${product.product_id}`}>
                                        <img
                                            src={product.picture ? urlStorage + '/' + JSON.parse(product.picture)[0] : notImage}
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
    )
}