import { ArrowRight04Icon, ArrowRightDoubleIcon } from 'hugeicons-react'
import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppDataContext } from '../../../context/AppDataContext'
import { urlStorage } from '../../../services/api'
import { EditField } from '../../EditField/EditField'
import { Modal } from '../../Modal/Modal'
import './ProductGrid.css'

export function ProductGrid({ data, updateProduct }) {

    const { categories } = useContext(AppDataContext)

    const [subcategories, setSubcategories] = useState([])
    const [categoryList, setCategoryList] = useState([])
    const [editField, setEditField] = useState(null)
    const [formData, setFormData] = useState({})
    const [product, setProduct] = useState(null)
    const [providers, setProviders] = useState(null)

    function getSubcategories(categories = []) {
        if (!categories || categories.length === 0 || !data?.subcategory_code) return;

        const subcategoryCodes = data.subcategory_code.split('|');

        const category = categories.find((cat) => cat.code === data.category_code);

        if (!category) return; // Asegurarse de que la categoría existe antes de acceder a `subcategories`

        const subcategoryNames = subcategoryCodes.map((code) => {
            const subcategory = category.subcategories?.find((sub) => sub.subcategory_code === code) || {};
            return subcategory.subcategory_name || "Subcategoría no encontrada";
        });

        setSubcategories(subcategoryNames);
    }

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
            setProduct(current => { return { ...current, ...editedProduct } })
            setEditField(null)
        }
    }

    useEffect(() => {
        getSubcategories(categories);
        setCategoryList(categories || []);
    }, [categories, data]);

    useEffect(() => {
        setFormData(data)
        setProduct(data)
        setProviders(data.providers)
    }, [])

    return (
        product &&
        <>
            <div className="productGrid">
                <div>
                    <img src={`${urlStorage}/${JSON.parse(product.thumbnails)[0]}`} />
                    <div>
                        <h3 title={product.name}>{product.name}</h3>
                        <div>
                            <span className='code'>Código: {product.code}</span>
                            {product.status == 'active' ?
                                <span onClick={() => handleEdit('status')} className={product.status}> <span>Cambiar</span> Activo</span> :
                                <span onClick={() => handleEdit('status')} className={product.status}> <span>Cambiar</span> Inactivo</span>
                            }
                        </div>

                    </div>
                </div>
                <div>
                    <span>{categoryList.find(e => e.code === product.category_code)?.name}</span>
                    {subcategories.map(e => <span>{e}</span>)}
                </div>
                <div className='prices'>
                    <div className='purchase-price'>
                        <p>Precios de compra</p>
                        {providers ?
                            providers.length != 0 ?
                                <ul>
                                    {[...providers]
                                        .sort((a, b) => a.pivot.purchase_price - b.pivot.purchase_price) // Ordena de menor a mayor
                                        .map((e, index) =>
                                            <li key={index}>
                                                <span>{e.name}</span>
                                                <ArrowRight04Icon />
                                                ${parseFloat(e.pivot.purchase_price)}
                                            </li>
                                        )}
                                </ul> :
                                <span>No tiene</span> :
                            '$' + product.pivot.purchase_price
                        }
                    </div>
                    <div className='sale-price'>
                        <p>Precio de venta</p>
                        <span onClick={() => handleEdit('price')}> <span>Cambiar</span> ${product.price}</span>
                    </div>
                </div>
                <div>
                    <p>Descuento</p>
                    {!product.discount ?
                        <span>No tiene descuento</span> :
                        <span>
                            <pre>{product.discount}%</pre>
                            <ArrowRight04Icon />
                            <pre> ${(product.discount * product.price) / 100}</pre>
                            <ArrowRight04Icon />
                            <pre> ${product.price - (product.discount * product.price) / 100}</pre>
                        </span>
                    }
                </div>
                <div className='stock'>
                    <p>Stock</p>
                    <span onClick={() => handleEdit('available_quantity')}> <span>Cambiar</span>{product.available_quantity}</span>
                </div>
                <Link to={'/producto/' + product.id}> <span>Ver detalle</span> <ArrowRightDoubleIcon /> </Link>
            </div>
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
        </>
    )
}