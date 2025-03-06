import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { api } from "api-services"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { DragAndDrop } from "../DragAndDrop/DragAndDrop"
import { Loading } from "../Loading/Loading"
import './AddProduct.css'

export function AddProduct() {

    const { Products } = api

    const products = new Products()

    const [images, setImages] = useState([])
    const [list, setList] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedSubcategories, setSelectedSubcategories] = useState([])
    const [errors, setErrors] = useState({})
    const [selectedProviders, setSelectedProviders] = useState({});


    const formRef = useRef()

    async function addProduct(e) {
        e.preventDefault()

        const formData = new FormData(e.target)

        const filteredProviders = Object.fromEntries(
            Object.entries(selectedProviders).filter(([providerId, price]) => price > 0)
        );


        const formObject = {
            subcategory_code: selectedSubcategories.join('|'),
            status: 'active',
            category_code: selectedCategory,
            providers: JSON.stringify(filteredProviders)
        };

        for (const [key, value] of Object.entries(formObject)) {
            formData.append(key, value)
        }

        images.forEach((image) => {
            formData.append('images[]', image)
            formData.append('thumbnails[]', image)
        })

        setErrors({})

        try {
            const response = await toast.promise(products.add({ data: formData }), {
                pending: 'Agregando producto...',
                success: 'Se agregó correctamente',
                error: 'Error, no se pudo agregar'
            })

            if (response.product) return discard()

        } catch (error) {
            const errorData = JSON.parse(error.message)
            if (errorData.errors) {
                setErrors(errorData.errors)
            } else {
                const message = errorData.message
            }
        }
    }

    function discard() {
        formRef.current.reset()
        setSelectedCategory('')
        setImages([])
        setSelectedSubcategories([])
    }

    return (
        <section className=" section-form">
            <form ref={formRef} className="form-add-product" onReset={discard} onSubmit={addProduct}>
                <div className="header-form">
                    <h1>Cargar nuevo producto</h1>
                    <p>Los campos con <span>*</span> son obligatorios</p>
                </div>
                <div>
                    <ProductImages images={images} setImages={setImages} />
                </div>
                <Form1
                    selectedProviders={selectedProviders}
                    setSelectedProviders={setSelectedProviders}
                />
                <Form2
                    list={list}
                    setList={setList}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    setSelectedSubcategories={setSelectedSubcategories}
                />
                <div>
                    <div>
                        <button type="submit" className="btn btn-solid">Agregar producto</button>
                        <button type="reset" className="btn btn-regular">Descartar</button>
                    </div>
                </div>
                <div>
                    <ul>
                        {errors.name && <li className="error">Falta completar con el nombre</li>}
                        {errors.price && <li className="error">Falta completar con el precio</li>}
                        {errors.available_quantity && <li className="error">Falta completar con la cantidad</li>}
                        {errors.category_code && <li className="error">Falta seleccionar una categoría</li>}
                        {errors.images && <li className="error">Falta seleccionar las imagenes (min. 1)</li>}
                    </ul>
                </div>
            </form>
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
    )
}

function ProductImages({ images, setImages }) {

    function removePicture(setImages, index) {
        setImages(current => current.filter((_, i) => i !== index))
    }

    return (
        <>
            <h3>Imagenes del producto <span>*</span></h3>
            <div className="selected-images">
                <span>{images.length}/5</span>
                <DragAndDrop setImages={setImages} />
            </div>
            {images.length != 0 &&
                <div className="preview-images">
                    {images.map((e, i) =>
                        <div>
                            <span onClick={() => removePicture(setImages, i)}><FontAwesomeIcon icon={faXmark} /></span>
                            <img src={URL.createObjectURL(e)} />
                        </div>

                    )}
                </div>
            }
        </>
    )
}

function Form1({ selectedProviders, setSelectedProviders }) {

    const [description, setDescription] = useState('')

    return (
        <>
            <div>
                <div>
                    <p>Nombre <span>*</span></p>
                    <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
                        <input type="text" className="input" name="name" placeholder="Nombre" />
                    </div>
                </div>
                <div>
                    <p>Descripción</p>
                    <div className="description">
                        <span>{description.length} / 500</span>
                        <textarea name="description" className="input" onChange={(e) => setDescription(e.target.value)} maxLength={500} placeholder="Descripción"></textarea>
                    </div>
                </div>
                <div>
                    <p>Cantidad de productos <span>*</span></p>
                    <input type="text" className="input" name="available_quantity" placeholder="Stock" />
                </div>
            </div>
            <Providers
                selectedProviders={selectedProviders}
                setSelectedProviders={setSelectedProviders}
            />
            <div>
                <h3>Precios</h3>
                <div>
                    <p>Precio <span>*</span></p>
                    <input type="number" className="input" name="price" placeholder="Precio" step={.1} />
                </div>
                <div>
                    <p>Descuento</p>
                    <input type="number" className="input" name="discount" placeholder="En porcentaje" />
                </div>
            </div>
        </>
    )
}

function Providers({ selectedProviders, setSelectedProviders }) {
    const [providers, setProviders] = useState(null);

    async function getProviders() {
        try {
            const response = await fetch("https://api.bazarrshop.com/api/provider", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw error;
            }

            const data = await response.json();
            setProviders(data);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getProviders();
    }, []);

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

    return (
        <>
            {providers ? (
                providers.length !== 0 ? (
                    <>
                        <div className="provider-list">
                            <h3>Proveedores</h3>
                            {providers.map((provider) => (
                                <div key={provider.id}>
                                    <label htmlFor={provider.name}>{provider.name}</label>
                                    <input
                                        id={provider.name}
                                        type="checkbox"
                                        onChange={() => handleSelectProvider(provider.id)}
                                        checked={!!selectedProviders[provider.id]}
                                    />
                                </div>
                            ))}
                        </div>
                        {Object.keys(selectedProviders).length > 0 && (
                            <div>
                                <h3>Precios de compra</h3>
                                {Object.keys(selectedProviders).map((providerId) => {
                                    const provider = providers.find((p) => p.id == providerId);
                                    return (
                                        <div className="purchase-price">
                                            <p>{provider.name} </p>
                                            <input
                                                className="input"
                                                type="number"
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
                                    );
                                })}

                            </div>
                        )}
                    </>
                ) : (
                    <div>
                        <p style={{ fontSize: "16px" }}>No hay proveedores agregados</p>
                        <Link to={"/agregar-proveedor"} className="btn btn-regular" style={{ width: "100%" }}>
                            Agregar proveedor
                        </Link>
                    </div>
                )
            ) : (
                <div>
                    <Loading />
                </div>
            )}
        </>
    );
}


function Form2(props) {

    const { list, setList, selectedCategory, setSelectedCategory, setSelectedSubcategories } = props
    const { Categories } = api

    const categories = new Categories()

    const [resetList, setResetList] = useState(false)

    function handleCheckboxChange(e) {
        const value = e.target.value

        if (e.target.checked) {
            setSelectedSubcategories((prevSelected) => [...prevSelected, value])
        } else {
            setSelectedSubcategories((prevSelected) =>
                prevSelected.filter((subcategory) => subcategory !== value)
            )
        }
    }

    async function getCategories() {
        setList(await categories.get({}))
    }

    useEffect(() => {
        getCategories()
    }, [])

    useEffect(() => {
        if (selectedCategory) {
            setResetList(true)
            setTimeout(() => setResetList(false), 0)
        }
        setSelectedSubcategories([])
    }, [selectedCategory])

    return (
        <>
            {list.length != 0 ?
                <>
                    <div>
                        <h3>Categoría <span>*</span></h3>
                        <div className="form-categories">
                            {!resetList &&
                                list.map(e =>
                                    <div key={e.code}>
                                        <input
                                            onChange={() => setSelectedCategory(e.code)}
                                            type="radio"
                                            name="category_code"
                                            id={e.code}
                                            value={e.code}
                                        />
                                        <label
                                            className={e.code === selectedCategory ? 'btn btn-solid' : 'btn btn-thins'}
                                            htmlFor={e.code}
                                        >
                                            {e.name}
                                        </label>
                                    </div>
                                )}
                        </div>
                    </div>
                    {selectedCategory &&
                        <div>
                            <h3>Subcategorías</h3>
                            <div className="form-categories">
                                {list.filter(e => selectedCategory == e.code)[0]?.subcategories.map(e =>
                                    <label key={e.subcategory_code} className="input-subcategory" tmlFor={e.subcategory_code}>
                                        {e.subcategory_name}
                                        <input
                                            type="checkbox"
                                            id={e.subcategory_code}
                                            value={e.subcategory_code}
                                            onChange={handleCheckboxChange}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    }
                </>
                :
                <div>
                    <Loading />
                </div>
            }
        </>
    )
}