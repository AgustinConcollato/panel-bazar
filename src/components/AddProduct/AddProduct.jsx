import { faArrowLeft, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { api } from "api-services"
import { DragAndDrop } from "../DragAndDrop/DragAndDrop"
import { Loading } from "../Loading/Loading"
import { generateId } from "../../utils/generateId"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './AddProduct.css'

export function AddProduct() {

    const { Products } = api

    const products = new Products()

    const [images, setImages] = useState([])
    const [list, setList] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedSubcategories, setSelectedSubcategories] = useState([])
    const [errors, setErrors] = useState({})

    const formRef = useRef()

    async function addProduct(e) {
        e.preventDefault()

        const formData = new FormData(e.target)

        const formObject = {
            id: generateId(),
            subcategory: selectedSubcategories.join('|'),
            status: 'active',
            category_id: selectedCategory,
            creation_date: new Date().getTime()
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
                error: 'Error, no se puedo agregar'
            })

            if (response.product) return discard()

        } catch (error) {
            const errorData = JSON.parse(error.message)
            if (errorData.errors) {
                setErrors(errorData.errors)
            } else {
                const message = errorData.message
                if (message.split(':')[0] == 'SQLSTATE[23000]') {
                    setErrors({ repeatedCode: true })
                }
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
        <section className="section-add-product">
            <header>
                <Link to={'/productos'} className="btn" ><FontAwesomeIcon icon={faArrowLeft} size="xs" /></Link>
                <h1>Nuevo producto</h1>
            </header>
            <form ref={formRef} className="form-add-product" onReset={discard} onSubmit={addProduct}>
                <div>
                    <Form1 errors={errors} />
                    <Form2
                        list={list}
                        setList={setList}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        setSelectedSubcategories={setSelectedSubcategories}
                    />
                </div>
                <div>
                    <ProductImages images={images} setImages={setImages} />
                    <div>
                        <button type="submit" className="btn btn-solid">Agregar producto</button>
                        <button type="reset" className="btn btn-thins">Descartar</button>
                    </div>
                    <ul>
                        {errors.name && <li className="error">Falta completar con el nombre</li>}
                        {errors.code && <li className="error">Falta completar con el código</li>}
                        {errors.price && <li className="error">Falta completar con el precio</li>}
                        {errors.category_id && <li className="error">Falta seleccionar una categoría</li>}
                        {errors.images && <li className="error">Falta seleccionar las imagenes (min. 1)</li>}
                        {errors.repeatedCode && <li className="error">El código de referencia ya esta registrado</li>}
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
            <h3>Imagenes del producto</h3>
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

function Form1() {

    const [description, setDescription] = useState('')

    return (
        <>
            <h3>Descripción</h3>
            <div>
                <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
                    <input type="text" name="name" placeholder="Nombre" />
                </div>
                <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', bottom: '10px', right: '10px', color: '#888' }} >{description.length} / 500</span>
                    <textarea name="description" onChange={(e) => setDescription(e.target.value)} maxLength={500} placeholder="Descripción"></textarea>
                </div>
            </div>
            <h3>Código de referencia</h3>
            <div>
                <input type="text" name="code" placeholder="Código" />
            </div>
            <h3>Precio</h3>
            <div className="container-price">
                <input type="number" name="price" placeholder="Precio" step={.1} />
                <input type="number" name="discount" placeholder="Descuento" />
            </div>
        </>
    )
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
            <h3>Categoría y subcategorías</h3>
            {list.length != 0 ?
                <div className="form-categories">
                    <div>
                        {!resetList &&
                            list.map(e =>
                                <div key={e.category_code}>
                                    <input
                                        onChange={() => setSelectedCategory(e.category_code)}
                                        type="radio"
                                        name="category_id"
                                        id={e.category_code}
                                        value={e.category_code}
                                    />
                                    <label
                                        className={e.category_code === selectedCategory ? 'btn btn-solid' : 'btn btn-thins'}
                                        htmlFor={e.category_code}
                                    >
                                        {e.category_name}
                                    </label>
                                </div>
                            )}
                    </div>
                    {selectedCategory &&
                        <div>
                            {list.filter(e => selectedCategory == e.category_code)[0]?.subcategories.map(e =>
                                <label key={e.subcategory_code} className="input-subcategory" tmlFor={e.subcategory_code}>{e.subcategory_name}
                                    <input
                                        type="checkbox"
                                        id={e.subcategory_code}
                                        value={e.subcategory_code}
                                        onChange={handleCheckboxChange}
                                    />
                                </label>
                            )}
                        </div>
                    }
                </div>
                :
                <Loading />
            }
        </>
    )
}