import { useParams } from "react-router-dom"
import { api, urlStorage as url } from "../../services/api"
import { useEffect, useState } from "react"
import { Loading } from "../Loading/Loading"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons"
import { Modal } from "../Modal/Modal"
import { EditField } from "../EditField/EditField"
import { toast, ToastContainer } from "react-toastify"
import './ProductDetail.css'
import 'react-toastify/dist/ReactToastify.css'
import { formatDate } from "../../utils/formatDate"

export function ProductDetail() {
    const { id } = useParams()
    const { products, categories } = api

    const [product, setProduct] = useState(null)
    const [error, setError] = useState(null)
    const [images, setImages] = useState([])
    const [thumbnails, setThumbnails] = useState([])
    const [position, setPosition] = useState(null)
    const [categoryList, setCategoryList] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [editField, setEditField] = useState(null)
    const [formData, setFormData] = useState({})

    async function getDetails() {
        try {
            const response = await products.search({ id })
            const { product, message, status } = response
            if (status === 'error') throw new Error(message)

            setProduct(product)
            setFormData(product)
            const { images, thumbnails } = product
            setImages(JSON.parse(images))
            setThumbnails(thumbnails !== "" ? JSON.parse(thumbnails) : [])
        } catch (error) {

            setProduct({})
            setError(error.message)
        }
    }

    async function getCategories() {
        try {
            const response = await categories.get({})
            setCategoryList(response)

            if (product && product.subcategory) {
                const subcategoryCodes = product.subcategory.split('|')
                const subcategoryNames = subcategoryCodes.map((code) => {
                    const category = response.find((category) => category.category_code === product.category_id)
                    const subcategory = category?.subcategories.find((subcategory) => subcategory.subcategory_code === code)
                    return subcategory?.subcategory_name || "Subcategoría no encontrada"
                })
                setSubcategories(subcategoryNames)
            }
        } catch (error) {
            console.log(error)
        }
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
        if (hasChanges) {

            const { product: editedProduct } = await toast.promise(products.update({ id: product.id, data: formData }), {
                pending: 'Editando producto...',
                success: 'Se editó correctamente',
                error: 'Error, no se puedo editar'
            })

            setProduct(editedProduct)
            setEditField(null)
        } else {
            toast.error('No hay cambios para guardar')
        }
    }

    document.onkeyup = (e) => {
        if (e.keyCode == 27) setEditField(null)
    }

    const categoryOptions = categoryList.map(category => ({
        code: category.category_code,
        name: category.category_name
    }))

    const subcategoryOptions = categoryList.find(category => category.category_code === product?.category_id)?.subcategories.map(subcategory => ({
        code: subcategory.subcategory_code,
        name: subcategory.subcategory_name
    })) || []

    useEffect(() => {
        getDetails()
    }, [id])

    useEffect(() => {
        product && getCategories()
    }, [product])

    return (
        <>
            {!product ? (
                <Loading />
            ) : error ? (
                <span>{error}</span>
            ) : (
                <section className="product-detail">
                    <div className="container-images">
                        <div className="container-thumbnails">
                            {thumbnails.map((e, i) => (
                                <img
                                    key={i}
                                    src={`${url}/${e}`}
                                    style={position === i ? { outline: '1px solid #3d6caa' } : {}}
                                    onClick={() => setPosition(i)}
                                />
                            ))}
                        </div>
                        {position !== null && <img src={`${url}/${images[position]}`} alt="" />}
                    </div>
                    <div className="info-product">
                        <h1 onClick={() => handleEdit('name')}>{product.name} <FontAwesomeIcon icon={faPenToSquare} /></h1>
                        <p>
                            Código de referencia <br /> {product.code}
                            <span>
                                Fecha de modificación <br /> {formatDate(product.last_date_modified)}
                            </span>
                        </p>
                        <ul>
                            <li onClick={() => handleEdit('status')}><span>Estado <FontAwesomeIcon icon={faPenToSquare} /></span><b>{product.status === 'active' ? 'Activo' : 'Inactivo'}</b></li>
                            <li onClick={() => handleEdit('price')}><span>Precio <FontAwesomeIcon icon={faPenToSquare} /></span><b>${product.price}</b></li>
                            <li onClick={() => handleEdit('discount')}><span>Descuento <FontAwesomeIcon icon={faPenToSquare} /></span><b>{product.discount || 0}%</b></li>
                            {product.description && <li onClick={() => handleEdit('description')}><span>Descripción <FontAwesomeIcon icon={faPenToSquare} /></span><b className="b-description">{product.description}</b></li>}
                            <li onClick={() => handleEdit('category_id')}><span>Categoría <FontAwesomeIcon icon={faPenToSquare} /></span><b>{categoryList.find(e => e.category_code === product.category_id)?.category_name}</b></li>
                            <li onClick={() => handleEdit('subcategory')}><span>Subcategorías <FontAwesomeIcon icon={faPenToSquare} /></span><b>{subcategories.join(' - ')}</b></li>
                        </ul>
                        <div className="actions">
                            <button className="btn"><FontAwesomeIcon icon={faTrashCan} /> Eliminar</button>
                        </div>
                    </div>
                    {editField && (
                        <Modal>
                            <form onSubmit={saveChange} className="container-children">
                                <h2>Editando {product.name}</h2>
                                <EditField
                                    field={editField}
                                    value={formData[editField]}
                                    onChange={handleEditChange}
                                    type={
                                        editField === 'price' || editField === 'discount' ? 'number' :
                                            editField === 'status' ? 'radio' :
                                                editField === 'category_id' ? 'select' :
                                                    editField === 'subcategory' ? 'checkbox' :
                                                        editField === 'description' ? 'textarea' : 'text'
                                    }
                                    options={
                                        editField === 'category_id' ? categoryOptions :
                                            editField === 'subcategory' ? subcategoryOptions : []
                                    }
                                />
                                <div className="actions-edit">
                                    <button type="button" className="btn" onClick={() => setEditField(null)}>Cancelar</button>
                                    <button type="submit" className="btn btn-solid" onClick={saveChange} >Guardar</button>
                                </div>
                            </form>
                            <div className="background-modal" onClick={() => setEditField(null)}></div>
                        </Modal>
                    )}
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
                </section>
            )}
        </>
    )
}