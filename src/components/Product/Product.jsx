import { Link } from 'react-router-dom'
import './Product.css'

export function Product({ data }) {

    const { id, name, discount, images, price } = data

    // /storage/images/products/${JSON.parse(images)[0]}

    return (
        <tr className='product'>
            <td className='container-img'>
                <img loading='lazy' src={``} />
            </td>
            <td>
                <span>{name}</span>
            </td>
            <td>{discount ?
                <div>
                    <span className='discount'>{discount}%</span>
                    <span>${price - (price * discount) / 100}</span>
                </div> :
                ''}
            </td>
            <td>${price}</td>
            <td>
                <Link to={`/producto/${id}`}>detalle</Link>
            </td>
        </tr>
    )
}