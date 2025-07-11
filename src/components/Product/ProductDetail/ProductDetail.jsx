import { faPenToSquare } from "@fortawesome/free-regular-svg-icons"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { AppDataContext } from "../../../context/AppDataContext"
import { api } from "../../../services/api"
import { formatDate } from "../../../utils/formatDate"
import { EditField } from "../../EditField/EditField"
import { Loading } from "../../Loading/Loading"
import { Modal } from "../../Modal/Modal"
import { ProductImages } from "../ProductImages/ProductImages"
import { Providers } from "../ProductProviders/ProductProviders"
import './ProductDetail.css'

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
            const response = await products.search({ id, options: { panel: true } })
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
            toast.info('No hay cambios para guardar')
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
        product && getSubcategories()
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
                        {/* <div>
                            <h3>Últimas ventas</h3>
                            <ul>
                                <li>
                                    Estado del stock
                                    <b>
                                        <span style={{
                                            background: product.sales_velocity.status === 'sin_ventas' ? '#eee' : product.sales_velocity.status.includes('bajo') ? '#ff8800' : '#e74c3c',
                                            color: product.sales_velocity.status === 'sin_ventas' ? '#000' : '#fff',
                                            borderRadius: 6,
                                            padding: '2px 8px',
                                            fontWeight: 400
                                        }}>
                                            {product.sales_velocity.status === 'sin_ventas'
                                                ? product.sales_velocity.status.replace('_', ' ')
                                                : product.sales_velocity.status.split('_')[1]}
                                        </span>
                                    </b>
                                </li>
                                <li>Venta en los últimos 30 días <b>{product.sales_velocity.total_sold_last_30_days}</b></li>
                                <li>Venta en la última semana <b>{product.sales_velocity.total_sold_last_week}</b></li>
                                <li>Cantidad aprox. por semana <b>{product.sales_velocity.velocity_per_week}</b></li>
                                <li>
                                    Semanas aprox. para agotar stock
                                    <div>
                                        <b style={{ marginLeft: 8 }}>{product.sales_velocity.weeks_until_stockout || 0}</b>
                                    <div style={{
                                        width: 180,
                                        height: 10,
                                        background: '#eee',
                                        borderRadius: 5,
                                        marginTop: 4,
                                        position: 'relative',
                                        display: 'inline-block',
                                        verticalAlign: 'middle'
                                    }}>
                                        <div style={{
                                            width: `${Math.min(1, product.sales_velocity.weeks_until_stockout / 12) * 100}%`,
                                            height: '100%',
                                            background: product.sales_velocity.weeks_until_stockout < 3 ? '#e74c3c' : product.sales_velocity.weeks_until_stockout < 6 ? '#ff8800' : '#66b819',
                                            borderRadius: 5,
                                            transition: 'width 0.3s'
                                        }} />
                                    </div>
                                    <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>(máx. 12 semanas)</span>
                                    </div>
                                </li>
                            </ul>
                        </div> */}
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
                            <li onClick={() => handleEdit('price')}><span>Precio venta <FontAwesomeIcon icon={faPenToSquare} /></span><b>${parseFloat(product.price).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</b></li>
                            <li onClick={() => handleEdit('discount')}><span>Descuento <FontAwesomeIcon icon={faPenToSquare} /></span><b>{product.discount || 0}%</b></li>
                            <li onClick={() => handleEdit('category_code')}><span>Categoría <FontAwesomeIcon icon={faPenToSquare} /></span><b>{categories && categories.find(e => e.code === product.category_code)?.name}</b></li>
                            <li onClick={() => handleEdit('subcategory_code')}><span>Subcategorías <FontAwesomeIcon icon={faPenToSquare} /></span><b>{subcategories.join(' - ')}</b></li>
                        </ul>
                    </div>
                    <Providers
                        currentProviders={currentProviders}
                    />
                    {editField && (
                        <Modal onClose={() => setEditField(null)}>
                            <form onSubmit={saveChange} className="edit-product-form">
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

