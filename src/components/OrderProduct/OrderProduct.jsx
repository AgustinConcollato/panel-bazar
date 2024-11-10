import { useState } from 'react'
import notImage from '../../assets/img/not-image-min.jpg'
import { api, urlStorage } from '../../services/api'
import { Modal } from '../Modal/Modal'
import { Loading } from '../Loading/Loading'

export function OrderProduct({ e, images, setOrderProducts, orderId }) {

    const { Order } = api

    const [edit, setEdit] = useState(false)
    const [remove, setRemove] = useState(false)
    const [modal, setModal] = useState(false)

    async function removeProductOrder(id) {
        const order = new Order()

        setRemove(true)
        try {
            const response = await order.remove({ orderId, productId: id })

            if (response) {
                setOrderProducts(current => current.filter(e => e.product_id != response.product_id))
                setRemove(false)
            }

        } catch (error) {
            console.log(error)
        }

    }

    function editOrder() {
        setModal(true)
        setEdit(true)
    }

    return (
        <>
            <tr key={e.productId}>
                <td className="quantity-td" >{e.quantity}</td>
                <td className="image-td" style={{ height: '65px', width: '65px' }}>{images && <img loading='lazy' src={e.picture == '-' ? notImage : `${urlStorage}/${JSON.parse(e.picture)[0]}`} />}</td>
                <td className="name-td" >{e.name}</td>
                <td className="price-td" >${e.price}</td>
                <td className="subtotal-td" >${e.subtotal}</td>
                <td className="options-td" >
                    <div>
                        <button className="btn" onClick={editOrder}>Editar</button>
                        <button className="btn btn-error-regular" onClick={() => removeProductOrder(e.product_id)}>{remove ? 'Eliminando...' : 'Eliminar'}</button>
                    </div>
                </td>
            </tr>
            {modal &&
                <Modal>
                    <div>editar</div>
                    <div className="background-modal" onClick={() => {
                        setEdit(false)
                        setModal(false)
                    }
                    }></div>
                </Modal>
            }
        </>
    )

}