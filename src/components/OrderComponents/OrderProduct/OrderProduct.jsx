import { useEffect, useState } from 'react'
import notImage from '../../../assets/img/not-image-min.jpg'
import { urlStorage } from '../../../services/api'
import { Modal } from '../../Modal/Modal'
import './OrderProduct.css'

export function OrderProduct({
    product: productData,
    setProducts,
    setOrderData,
    orderId,
    orderStatus,
    removeProductOrder,
    updateOrder,
}) {

    const [edit, setEdit] = useState(null)
    const [formData, setFormData] = useState({})
    const [product, setProduct] = useState({})

    const [price, setPrice] = useState(productData.price)
    const [quantity, setQuantity] = useState(productData.quantity)
    const [discount, setDiscount] = useState(productData.discount)

    async function saveChange(e) {
        e.preventDefault()

        const hasChanges = Object.keys(formData).some(key => formData[key] !== product[key])
        const response = await updateOrder({ hasChanges, formData })

        if (response) {
            setProduct(response)
            setProducts((prev) =>
                prev.map((p) => (p.id === response.id ? response : p))
            )
            setEdit(null)
        }
    }

    function handleEditChange(field, value) {
        setFormData((prevData) => ({ ...prevData, [field]: value }))

        if (field === 'price') {
            setPrice(value)
        } else if (field === 'quantity') {
            setQuantity(value)
        } else if (field === 'discount') {
            setDiscount(value)
        }
    }

    document.onkeyup = (e) => {
        if (e.keyCode == 27) setEdit(null)
    }

    useEffect(() => {
        setFormData(productData)
        setProduct(productData)
    }, [])

    return (
        product &&
        <>
            <div onClick={() => setEdit(true)} className='order-product'>
                <div className="container-img">
                    <img loading='lazy' src={!product.picture ? notImage : `${urlStorage}/${JSON.parse(product.picture)[0]}`} />
                </div>
                <h4>{product.name}</h4>
                <p>${product.price}</p>
                <p className='quantity'>{product.quantity}</p>
                <p>{product.discount ? product.discount + '%' : null}</p>
            </div>

            {edit &&
                <Modal>
                    <section className="section-form container-children">
                        <form className='edit-order-product'>
                            <h2>Editar {product.name}</h2>
                            <div>
                                <div>
                                    <p>Precio</p>
                                    <input
                                        className='input'
                                        type="number"
                                        placeholder='Precio'
                                        name='price'
                                        value={price}
                                        onChange={(e) => handleEditChange('price', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p>Cantidad</p>
                                    <input
                                        className='input'
                                        type="number"
                                        placeholder='Cantidad'
                                        name='quantity'
                                        value={quantity}
                                        onChange={(e) => handleEditChange('quantity', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p>Descuento</p>
                                    <input
                                        className='input'
                                        type="number"
                                        placeholder='Descuento'
                                        name='discount'
                                        value={discount}
                                        onChange={(e) => handleEditChange('discount', e.target.value)}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-solid" onClick={saveChange} >Guardar cambios</button>
                            <button type="button" className="btn" onClick={() => setEdit(null)}>Cancelar</button>
                            <button type='button' className='btn btn-error-regular' onClick={() => removeProductOrder(product.product_id)}>Eliminar del pedido</button>
                        </form>
                    </section>
                    <div className="background-modal" onClick={() => setEdit(null)}></div>
                </Modal>
            }
        </>
    )

}