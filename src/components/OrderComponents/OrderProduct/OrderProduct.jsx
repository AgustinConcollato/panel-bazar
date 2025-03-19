import { useEffect, useState } from 'react'
import notImage from '../../../assets/img/not-image-min.jpg'
import { api, urlStorage } from '../../../services/api'
import { EditField } from '../../EditField/EditField'
import { Modal } from '../../Modal/Modal'
import './OrderProduct.css'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function OrderProduct({
    product: productData,
    setOrderProducts,
    orderId,
    orderStatus,
    updateOrder,
}) {

    const { Order } = api

    const [edit, setEdit] = useState(null)
    const [remove, setRemove] = useState(false)
    const [formData, setFormData] = useState({})
    const [product, setProduct] = useState({})

    const order = new Order()

    async function removeProductOrder(id) {

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

    async function saveChange(e) {
        e.preventDefault()

        const hasChanges = Object.keys(formData).some(key => formData[key] !== product[key])
        const response = await updateOrder({ hasChanges, formData })

        if (response) {
            setProduct(response)
            setEdit(null)
        }
    }

    function handleEditChange(field, value) {
        setFormData((prevData) => ({ ...prevData, [field]: value }))
    }

    function handleEdit(field) {
        setEdit(field)
    }

    document.onkeyup = (e) => {
        if (e.keyCode == 27) setEdit(null)
    }

    useEffect(() => {
        setFormData(productData)
        setProduct(productData)
        console.log(productData)
    }, [])

    return (
        product &&
        <>
            <tr>
                <td className="quantity-td">{orderStatus == 'pending' ? <span onClick={() => handleEdit('quantity')}> {product.quantity} <FontAwesomeIcon icon={faPenToSquare} /> </span> : product.quantity}</td>
                <td className="image-td" style={{ height: '65px', width: '65px' }}> <img loading='lazy' src={!product.picture ? notImage : `${urlStorage}/${JSON.parse(product.picture)[0]}`} /></td>
                <td className="name-td">{orderStatus == 'pending' ? <span onClick={() => handleEdit('name')}> {product.name} <FontAwesomeIcon icon={faPenToSquare} /> </span> : product.name}</td>
                <td className="price-td">{orderStatus == 'pending' ? <span onClick={() => handleEdit('price')}> ${parseFloat(product.price)} <FontAwesomeIcon icon={faPenToSquare} /> </span> : '$' + parseFloat(product.price)}</td>
                <td className="price-td"><span onClick={() => handleEdit('discount')}>{product.discount || 0}% <FontAwesomeIcon icon={faPenToSquare} /> </span></td>
                <td className="subtotal-td" >${parseFloat(product.subtotal)}</td>
                {orderStatus == 'pending' &&
                    <td className="options-td" >
                        <div>
                            <button className="btn btn-error-regular" onClick={() => removeProductOrder(product.product_id)}>{remove ? 'Eliminando...' : 'Eliminar'}</button>
                        </div>
                    </td>
                }
            </tr>
            {
                edit &&
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
        </>
    )

}