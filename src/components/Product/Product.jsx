import { Link } from 'react-router-dom'
import './Product.css'
import { urlStorage } from '../../services/api'

export function Product({ data }) {

    const { id, name, discount, thumbnails, price } = data

    return (
        <tr className='product'>
            <td className='container-img'>
                <img loading='lazy' src={`${urlStorage}/${JSON.parse(thumbnails)[0]}`} />
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