import { Link, useNavigate, useParams } from "react-router-dom"
import { api, url, urlStorage } from "../../services/api"
import { useContext, useEffect, useState } from "react"
import { Loading } from "../Loading/Loading"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons"
import { Modal } from "../Modal/Modal"
import { EditField } from "../EditField/EditField"
import { toast, ToastContainer } from "react-toastify"
import { formatDate } from "../../utils/formatDate"
import './ProductDetail.css'
import 'react-toastify/dist/ReactToastify.css'
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { AppDataContext } from "../../context/AppDataContext"
import { ImageAdd01Icon } from "hugeicons-react"

export function ProductDetail() {
    const { id } = useParams()
    const { Products, Categories } = api

    const products = new Products()
    const categories = new Categories()

    const [product, setProduct] = useState(null)
    const [error, setError] = useState(null)
    const [images, setImages] = useState([])
    const [thumbnails, setThumbnails] = useState([])
    const [position, setPosition] = useState(null)
    const [categoryList, setCategoryList] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [editField, setEditField] = useState(null)
    const [formData, setFormData] = useState({})
    const [newImageUpdate, setNewImageUpdate] = useState(null)
    const [newImage, setNewImage] = useState(null)
    const [currentProviders, setCurrentProviders] = useState(null)

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

    async function getCategories() {
        try {
            const response = await categories.get({})
            setCategoryList(response)
            if (product && product.subcategory_code) {
                const subcategoryCodes = product.subcategory_code.split('|')
                const subcategoryNames = subcategoryCodes.map((code) => {
                    const category = response.find((category) => category.code === product.category_code)
                    const subcategory = category?.subcategories.find((subcategory) => subcategory.subcategory_code === code)
                    return subcategory?.subcategory_name || "Subcategoría no encontrada"
                })
                console.log(response)
                setSubcategories(subcategoryNames)
            }
        } catch (error) {
            console.log(error)
        }
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

    async function addNewImage(e) {
        e.preventDefault()

        const formData = new FormData()

        formData.append('new_image', e.target[0].files[0])

        const response = await toast.promise(products.updateImage({ id: product.id, data: formData, type: 'add' }), {
            pending: 'Subiendo imagen...',
            success: 'Imagen subida correctamente',
            error: 'Error, no se pudo subir la imagen'
        })

        const { images, thumbnails } = response.product

        setImages(JSON.parse(images))
        setThumbnails(thumbnails !== "" ? JSON.parse(thumbnails) : [])
        setNewImage(null)
    }

    async function deleteImage() {

        const response = await toast.promise(products.deleteImage({ id: product.id, index: position }), {
            pending: 'Eliminando imagen...',
            success: 'Imagen eliminada correctamente',
            error: 'Error, no se pudo eliminar la imagen'
        })

        const { images, thumbnails } = response.product

        setImages(JSON.parse(images))
        setThumbnails(thumbnails !== "" ? JSON.parse(thumbnails) : [])
        setNewImage(null)
        setPosition(null)
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

    document.onkeyup = (e) => {
        if (e.keyCode == 27) setEditField(null)
    }

    const categoryOptions = categoryList.map(category => ({
        code: category.code,
        name: category.name
    }))

    const subcategoryOptions = categoryList.find(category => category.code === product?.category_code)?.subcategories.map(subcategory => ({
        code: subcategory.subcategory_code,
        name: subcategory.subcategory_name
    })) || []



    useEffect(() => {
        getDetails(id)
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
                    <div className="container-images">
                        <div className="container-thumbnails">
                            {images.length <= 4 &&
                                <form onSubmit={addNewImage} className="form-add-image">
                                    <span>
                                        <ImageAdd01Icon
                                            size={32}
                                        />
                                        Nueva foto
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/webp"
                                        onChange={(e) => setNewImage(e.target.files[0])}
                                    />
                                    {newImage &&
                                        <div className="container-main-image">
                                            <img src={URL.createObjectURL(newImage)} />
                                            <div>
                                                <button type="reset" className="btn" onClick={() => {
                                                    setNewImage(null)
                                                    setPosition(null)
                                                }}>Cancelar</button>
                                                <button type="submit" className="btn btn-regular">Subir imagen</button>
                                            </div>
                                        </div>
                                    }
                                </form>
                            }
                            {thumbnails.map((e, i) => (
                                <img
                                    key={i}
                                    src={`${urlStorage}/${e}`}
                                    // src={`https://api.bazarrshop.com/storage/${e}`}
                                    style={position === i ? { outline: '1px solid #3d6caa' } : {}}
                                    onClick={() => setPosition(i)}
                                />
                            ))}
                        </div>
                        {!newImage &&
                            position !== null &&
                            <div className="container-main-image">
                                <img
                                    src={`${urlStorage}/${images[position]}`}
                                // src={`https://api.bazarrshop.com/storage/${images[position]}`}
                                />
                                <div>
                                    <button onClick={() => handleEdit('img')} className="btn">Cambiar foto</button>
                                    {images.length > 1 && <button onClick={deleteImage} className="btn btn-error-regular"> Eliminar foto</button>}
                                </div>
                                <FontAwesomeIcon icon={faXmark} onClick={() => setPosition(null)} />
                            </div>
                        }
                    </div>
                    <div className="detail-description" onClick={() => handleEdit('description')}>
                        <h3>Descripción <FontAwesomeIcon icon={faPenToSquare} /></h3>
                        <p>{product.description || 'No tiene descripción'}</p>
                    </div>
                    <div className="info-product">
                        <ul>
                            <li onClick={() => handleEdit('available_quantity')}><span>Stock <FontAwesomeIcon icon={faPenToSquare} /></span><b>{product.available_quantity}</b></li>
                            <li onClick={() => handleEdit('price')}><span>Precio <FontAwesomeIcon icon={faPenToSquare} /></span><b>${product.price}</b></li>
                            <li onClick={() => handleEdit('discount')}><span>Descuento <FontAwesomeIcon icon={faPenToSquare} /></span><b>{product.discount || 0}%</b></li>
                            <li onClick={() => handleEdit('category_code')}><span>Categoría <FontAwesomeIcon icon={faPenToSquare} /></span><b>{categoryList.find(e => e.code === product.category_code)?.name}</b></li>
                            <li onClick={() => handleEdit('subcategory_code')}><span>Subcategorías <FontAwesomeIcon icon={faPenToSquare} /></span><b>{subcategories.join(' - ')}</b></li>
                        </ul>
                    </div>
                    <Providers currentProviders={currentProviders} />
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

function Providers({ currentProviders }) {

    const { id } = useParams()
    const { providers } = useContext(AppDataContext)

    const [selectedProviders, setSelectedProviders] = useState({});
    const [providerList, setProviderList] = useState(currentProviders || null)


    function handleSelectProvider(providerId) {
        setSelectedProviders((prev) => {
            const updated = { ...prev };

            if (updated[providerId]) {
                delete updated[providerId]; // Si ya está seleccionado, lo eliminamos
            } else {
                updated[providerId] = ''; // Agregamos un campo vacío para el precio
            }

            return updated;
        });
    }

    function handlePriceChange(providerId, price) {
        setSelectedProviders((prev) => {
            // Si el precio es 0, eliminamos el proveedor
            if (price < 0) {
                const newSelectedProviders = { ...prev };
                delete newSelectedProviders[providerId]; // Eliminar el proveedor
                return newSelectedProviders;
            }

            // Si el precio no es 0, actualizamos el proveedor
            return {
                ...prev,
                [providerId]: price,
            };
        });
    }

    async function addPurchasePrice(e) {
        e.preventDefault()
        const formData = new FormData(e.target)

        const filteredProviders = Object.fromEntries(
            Object.entries(selectedProviders).filter(([providerId, price]) => price > 0)
        )

        formData.append('providers', JSON.stringify(filteredProviders))
        formData.append('product_id', id)

        try {
            const response = await fetch(`${url}/provider/assign-product`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: formData
            })

            if (!response.ok) {
                const error = await response.json()
                throw error
            }

            const product = await response.json()

            setProviderList(product.product.providers)
            setSelectedProviders({})
        } catch (error) {
            console.log(error)
        }

    }

    return (
        providers ? (
            <div className="info-product" >
                <h3>Proveedores - Precios de compra</h3>
                <ul className="provider-list">
                    {providers.map((provider) => {
                        const existingProvider = providerList?.find(p => p.id === provider.id);
                        const hasPrice = existingProvider?.pivot?.purchase_price;

                        return (
                            <label htmlFor={provider.name}>
                                <li key={provider.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span>
                                        <input
                                            id={provider.name}
                                            type="checkbox"
                                            onChange={() => handleSelectProvider(provider.id)}
                                            checked={!!selectedProviders[provider.id]}
                                        />
                                        {provider.name}
                                    </span>
                                    {hasPrice ? <b>${hasPrice}</b> : '-'}
                                </li>
                            </label>
                        );
                    })}
                </ul>
                {providers.length !== 0 ? (
                    <form onSubmit={addPurchasePrice}>
                        {Object.keys(selectedProviders).length > 0 && (
                            <div>
                                <h3>Precios de compra</h3>
                                {Object.keys(selectedProviders).map((providerId) => {
                                    const provider = providers.find((p) => p.id == providerId);
                                    return (
                                        <>
                                            <div className="purchase-price">
                                                <p>{provider.name}</p>
                                                <input
                                                    className="input"
                                                    type="number"
                                                    step={.01}
                                                    value={selectedProviders[providerId]}
                                                    onChange={(e) => handlePriceChange(providerId, e.target.value)}
                                                    placeholder="Ingrese el precio"
                                                />
                                                <button
                                                    type="button"
                                                    className="btn"
                                                    onClick={() => handlePriceChange(providerId, -1)}
                                                >
                                                    <FontAwesomeIcon icon={faXmark} size="xs" />
                                                </button>
                                            </div>
                                        </>
                                    );
                                })}
                                <button type="submit" className="btn btn-solid">Actualizar precios</button>
                            </div>
                        )}
                    </form>
                ) : (
                    <div>
                        <p style={{ fontSize: "16px" }}>No hay proveedores agregados</p>
                        <Link to={"/agregar-proveedor"} className="btn btn-regular" style={{ width: "100%" }}>
                            Agregar proveedor
                        </Link>
                    </div>
                )}
            </div>
        ) : (
            <div>
                <Loading />
            </div>
        )
    );
}