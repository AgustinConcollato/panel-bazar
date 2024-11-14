import { useEffect, useState } from 'react'
import notImage from '../../assets/img/not-image-min.jpg'
import { api, urlStorage } from '../../services/api'
import { EditField } from '../EditField/EditField'
import { Modal } from '../Modal/Modal'
import { toast, ToastContainer } from 'react-toastify'
import './OrderProduct.css'

export function OrderProduct({ product, images, setOrderProducts, orderData }) {

    const { Order } = api

    const [edit, setEdit] = useState(null)
    const [remove, setRemove] = useState(false)
    const [formData, setFormData] = useState({})

    const order = new Order()

    async function removeProductOrder(id) {

        setRemove(true)
        try {
            const response = await order.remove({ orderId: orderData.id, productId: id })

            if (response) {
                setOrderProducts(current => current.filter(e => e.product_id != response.product_id))
                setRemove(false)
            }

        } catch (error) {
            console.log(error)
        }
    }

    async function saveChange(e) {
        e.preventDefault()

        const hasChanges = Object.keys(formData).some(key => formData[key] !== product[key])
        if (hasChanges) {

            const response = await toast.promise(order.update(formData), {
                pending: 'Editando producto...',
                success: 'Se editó correctamente',
                error: 'Error, no se puedo editar'
            })

            setOrderProducts(current =>
                current.map(item =>
                    item.product_id === response.product_id ? response : item
                )
            );
            setEdit(null)
        } else {
            toast.error('No hay cambios para hacer')
        }
    }

    function handleEditChange(field, value) {
        setFormData((prevData) => ({ ...prevData, [field]: value }))
    }

    function handleEdit(field) {
        setEdit(field)
    }

    useEffect(() => {
        setFormData(product)
    }, [])

    return (
        <>
            <tr>
                <td className="quantity-td" onClick={() => handleEdit('quantity')}>{product.quantity}</td>
                <td className="image-td" style={{ height: '65px', width: '65px' }}>{images && <img loading='lazy' src={product.picture == '-' ? notImage : `${urlStorage}/${JSON.parse(product.picture)[0]}`} />}</td>
                <td className="name-td" onClick={() => handleEdit('name')}>{product.name}</td>
                <td className="price-td" onClick={() => handleEdit('price')}>${product.price}</td>
                <td className="subtotal-td" >${product.subtotal}</td>
                {orderData.status == 'pending' &&
                    <td className="options-td" >
                        <div>
                            <button className="btn btn-error-regular" onClick={() => removeProductOrder(product.product_id)}>{remove ? 'Eliminando...' : 'Eliminar'}</button>
                        </div>
                    </td>
                }
            </tr>
            {edit &&
                <Modal>
                    <form className='edit-order-product'>
                        <EditField
                            field={edit}
                            value={formData[edit]}
                            onChange={handleEditChange}
                            type={edit != 'name' ? 'number' : 'text'}
                        />
                        <div className="actions-edit">
                            <button type="button" className="btn" onClick={() => setEdit(null)}>Cancelar</button>
                            <button type="submit" className="btn btn-solid" onClick={saveChange} >Guardar</button>
                        </div>
                    </form>
                    <div className="background-modal" onClick={() => setEdit(null)}></div>
                </Modal>
            }
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition:Bounce
                stacked />
        </>
    )

}