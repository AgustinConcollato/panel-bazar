import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { urlStorage } from 'api-services'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EditField } from '../EditField/EditField'
import { Modal } from '../Modal/Modal'
import './Product.css'

export function Product({ data, updateProduct }) {

    const [editField, setEditField] = useState(null)
    const [formData, setFormData] = useState({})
    const [product, setProduct] = useState(null)

    document.onkeyup = (e) => {
        if (e.keyCode == 27) setEditField(null)
    }

    function handleEditChange(field, value) {
        const date = new Date().getTime()
        setFormData((prevData) => ({ ...prevData, [field]: value, last_date_modified: date }))
    }

    function handleEdit(field) {
        setEditField(field)
    }

    async function saveChange(e) {
        e.preventDefault()

        const hasChanges = Object.keys(formData).some(key => formData[key] !== product[key])
        const editedProduct = await updateProduct({ hasChanges, product, formData })

        if (editedProduct) {
            setProduct(editedProduct)
            setEditField(null)
        }
    }

    useEffect(() => {
        setFormData(data)
        setProduct(data)
    }, [])

    return (
        product && (
            <tr className='product'>
                <td className='container-img'>
                    <img loading='lazy' src={`${urlStorage}/${JSON.parse(product.thumbnails)[0]}`} />
                </td>
                <td>
                    <span>{product.name}</span>
                </td>
                <td>
                    {product.status == 'active' ?
                        <span
                            className='product-status product-active'
                            onClick={() => handleEdit('status')}
                        >
                            Activo
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </span> :
                        <span
                            className='product-status product-inactive'
                            onClick={() => handleEdit('status')}
                        >
                            Inactivo
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </span>
                    }
                </td>
                <td>
                    {product.discount &&
                        <div>
                            <span className='discount'>{product.discount}%</span>
                            <span>${(product.price * product.discount) / 100} / ${product.price - (product.price * product.discount) / 100}</span>
                        </div>
                    }
                </td>
                <td className='cell-price'><span onClick={() => handleEdit('price')}> ${product.price} <FontAwesomeIcon icon={faPenToSquare} /> </span></td>
                <td>
                    <Link to={`/producto/${product.id}`}>detalle</Link>
                </td>
                {editField &&
                    <Modal>
                        <form onSubmit={saveChange} className="container-children">
                            <h2>Editando {product.name}</h2>
                            <EditField
                                field={editField}
                                value={formData[editField]}
                                onChange={handleEditChange}
                                type={editField === 'status' ? 'radio' : 'number'}
                                options={[]}
                            />
                            <div className="actions-edit">
                                <button type="button" className="btn" onClick={() => setEditField(null)}>Cancelar</button>
                                <button type="submit" className="btn btn-solid" onClick={saveChange} >Guardar</button>
                            </div>
                        </form>
                        <div className="background-modal" onClick={() => setEditField(null)}></div>
                    </Modal>
                }
            </tr>
        )
    )
}