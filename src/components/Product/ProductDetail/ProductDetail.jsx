import { faPenToSquare } from "@fortawesome/free-regular-svg-icons"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { AppDataContext } from "../../../context/AppDataContext"
import { api, url } from "../../../services/api"
import { formatDate } from "../../../utils/formatDate"
import { EditField } from "../../EditField/EditField"
import { Loading } from "../../Loading/Loading"
import { Modal } from "../../Modal/Modal"
import './ProductDetail.css'
import { ProductImages } from "../ProductImages/ProductImages"
import { Providers } from "../ProductProviders/ProductProviders"

export function ProductDetail() {
    const { id } = useParams()
    const { Products } = api

    const products = new Products()

    const { categories } = useContext(AppDataContext)

    const [product, setProduct] = useState(null)
    const [error, setError] = useState(null)
    const [images, setImages] = useState([])
    const [thumbnails, setThumbnails] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [editField, setEditField] = useState(null)
    const [formData, setFormData] = useState({})
    const [newImageUpdate, setNewImageUpdate] = useState(null)
    const [currentProviders, setCurrentProviders] = useState(null)
    const [categoryOptions, setCategoryOptions] = useState(null)
    const [subcategoryOptions, setSubcategoryOptions] = useState(null)
    const [position, setPosition] = useState(null)

    async function getDetails(id) {
        try {
            const response = await products.search({ id })
            const { product, message, status } = response
            if (status === 'error') throw new Error(message)

            setProduct(product)
            setFormData(product)
            setCurrentProviders(product.providers)
            const { images, thumbnails } = product
            setImages(JSON.parse(images))
            setThumbnails(thumbnails !== "" ? JSON.parse(thumbnails) : [])

            document.title = product.name
        } catch (error) {

            setProduct({})
            setError(error.message)
        }
    }

    async function getSubcategories() {

        const subcategoryCodes = product.subcategory_code ? product.subcategory_code.split('|') : []
        const subcategoryNames = subcategoryCodes.map((code) => {
            const category = categories.find((category) => category.code === product.category_code)
            const subcategory = category?.subcategories.find((subcategory) => subcategory.subcategory_code === code)
            return subcategory?.subcategory_name || "Subcategoría no encontrada"
        })

        setSubcategories(subcategoryNames)

        setCategoryOptions(categories.map(category => ({
            code: category.code,
            name: category.name
        })))

        setSubcategoryOptions(categories.find(category => category.code === product?.category_code)?.subcategories.map(subcategory => ({
            code: subcategory.subcategory_code,
            name: subcategory.subcategory_name
        })) || [])
    }

    function handleEditChange(field, value) {

        if (field === 'img') {
            setNewImageUpdate(value)
            return
        }
        const date = new Date().getTime()
        setFormData((prevData) => ({ ...prevData, [field]: value, last_date_modified: date }))
    }

    function handleEdit(field) {
        setEditField(field)
    }

    async function saveChange(e) {
        e.preventDefault()

        if (editField === 'img') {
            const formData = new FormData()

            formData.append('new_image', newImageUpdate)
            formData.append('index', position)

            const response = await toast.promise(products.updateImage({ id: product.id, data: formData, type: 'update' }), {
                pending: 'Subiendo imagen...',
                success: 'Imagen subida correctamente',
                error: 'Error, no se pudo subir la imagen'
            })

            const { images, thumbnails } = response.product

            setImages(JSON.parse(images))
            setThumbnails(thumbnails !== "" ? JSON.parse(thumbnails) : [])

            setEditField(null)
            setNewImageUpdate(null)
            return
        }

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

    useEffect(() => {
        const handleKeyUp = (e) => {
            if (e.keyCode === 27) {
                setEditField(null);
                setFormData(product);
            }
        };

        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, [product]);

    useEffect(() => {
        setProduct(null)
        getDetails(id)
    }, [id])

    useEffect(() => {
        getSubcategories()
    }, [product, categories])

    return (
        <>
            {!product ? (
                <Loading />
            ) : error ? (
                <span>{error}</span>
            ) : (
                <section className="product-detail">
                    <div className="info-product">
                        <header>
                            <div>
                                <h1 onClick={() => handleEdit('name')}>{product.name} <FontAwesomeIcon icon={faPenToSquare} /></h1>
                                {product.status == 'active' ?
                                    <span onClick={() => handleEdit('status')} className={product.status}>Activo <span><FontAwesomeIcon icon={faPenToSquare} /></span></span> :
                                    <span onClick={() => handleEdit('status')} className={product.status}>Inactivo <span><FontAwesomeIcon icon={faPenToSquare} /></span></span>
                                }
                            </div>
                            <p>
                                <span>
                                    Código de referencia: <b>{product.code}</b>
                                </span>
                                <span>
                                    Fecha de modificación: <b>{formatDate(product.updated_at)}</b>
                                </span>
                            </p>
                        </header>
                    </div>
                    <ProductImages
                        images={images}
                        thumbnails={thumbnails}
                        setImages={setImages}
                        setThumbnails={setThumbnails}
                        handleEdit={handleEdit}
                        position={position}
                        setPosition={setPosition}
                    />
                    <div className="detail-description" onClick={() => handleEdit('description')}>
                        <h3>Descripción <FontAwesomeIcon icon={faPenToSquare} /></h3>
                        <pre>{product.description || 'No tiene descripción'}</pre>
                    </div>
                    <div className="info-product">
                        <ul>
                            <li onClick={() => handleEdit('available_quantity')}><span>Stock <FontAwesomeIcon icon={faPenToSquare} /></span><b>{product.available_quantity}</b></li>
                            <li onClick={() => handleEdit('price')}><span>Precio venta <FontAwesomeIcon icon={faPenToSquare} /></span><b>${product.price}</b></li>
                            <li onClick={() => handleEdit('discount')}><span>Descuento <FontAwesomeIcon icon={faPenToSquare} /></span><b>{product.discount || 0}%</b></li>
                            <li onClick={() => handleEdit('category_code')}><span>Categoría <FontAwesomeIcon icon={faPenToSquare} /></span><b>{categories && categories.find(e => e.code === product.category_code)?.name}</b></li>
                            <li onClick={() => handleEdit('subcategory_code')}><span>Subcategorías <FontAwesomeIcon icon={faPenToSquare} /></span><b>{subcategories.join(' - ')}</b></li>
                        </ul>
                    </div>
                    <Providers
                        currentProviders={currentProviders}
                    />
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
                                                editField === 'category_code' ? 'select' :
                                                    editField === 'subcategory_code' ? 'checkbox' :
                                                        editField === 'description' ? 'textarea' :
                                                            editField === 'img' ? 'img' :
                                                                editField === 'available_quantity' ? 'number' : 'text'
                                    }
                                    options={
                                        editField === 'category_code' ? categoryOptions :
                                            editField === 'subcategory_code' ? subcategoryOptions : []
                                    }
                                />
                                {(editField === 'img' && newImageUpdate) &&
                                    <img
                                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                        src={URL.createObjectURL(newImageUpdate)}
                                    />
                                }
                                <div className="actions-edit">
                                    <button type="button" className="btn" onClick={() => {
                                        setEditField(null)
                                        setFormData(product)
                                    }
                                    }>Cancelar</button>
                                    <button type="submit" className="btn btn-solid" onClick={saveChange} >Guardar</button>
                                </div>
                            </form>
                            <div className="background-modal" onClick={() => setEditField(null)}></div>
                        </Modal>
                    )}
                </section >
            )
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

