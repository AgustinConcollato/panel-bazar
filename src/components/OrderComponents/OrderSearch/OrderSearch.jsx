import { useEffect, useRef, useState } from "react";
import { toast } from 'react-toastify';
import { api, urlStorage } from "../../../services/api";
import { Loading } from "../../Loading/Loading";
import { Modal } from "../../Modal/Modal";
import './OrderSearch.css';

export function OrderSearch({ orderId, setOrderProducts, setOrderData }) {
    const { Products, Order } = api;
    const products = new Products();

    const [productList, setProductList] = useState(null);
    const [selected, setSelected] = useState(false);
    const [name, setName] = useState(null);
    const [filteredOptions, setFilteredOptions] = useState([])
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const [hidden, setHidden] = useState(true)

    const inputRef = useRef(null)
    const dropdownRef = useRef(null)
    const optionRefs = useRef([])

    async function getProducts() {
        const options = {
            page: 1,
            status: 'active',
            name,
            available_quantity: true
        };

        setProductList(null);
        const dataPage = await products.search({ options });
        setProductList(dataPage.data);
        setFilteredOptions(dataPage.data)
    }

    async function addProduct(e) {
        e.preventDefault()

        const order = new Order()
        const formData = new FormData(e.target)

        const { thumbnails, id, name, price, providers } = selected

        const purchasePrice = () => {
            if (providers.length == 0) {
                return (price * 66) / 100;
            } else if (providers.length == 1) {
                return providers[0].pivot.purchase_price
            } else {
                const total = providers.reduce((a, provider) => a + parseFloat(provider.pivot.purchase_price), 0)
                return total / providers.length
            }
        }

        thumbnails && formData.append('picture', thumbnails)
        formData.append('purchase_price', purchasePrice())
        formData.append('product_id', id)
        formData.append('order_id', orderId)
        formData.append('name', name)
        formData.append('price', price)

        try {
            const product = await toast.promise(order.add(formData), {
                pending: 'Agregando producto...',
                success: 'Se agregó correctamente',
            })

            setOrderProducts(current => [...current, product])

            // Limpiar estados después de agregar producto
            setName('')
            setSelected(false)
            setHidden(true)
            setFilteredOptions([])
            setProductList(null)

        } catch (error) {
            toast.error(error.error)
            if (error.errors) {
                return toast.error('Error, falta agregar la cantidad')
            }
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'ArrowDown') {
            setHighlightedIndex((prevIndex) =>
                prevIndex === -1 ? 0 : Math.min(prevIndex + 1, filteredOptions.length - 1)
            )
        } else if (event.key === 'ArrowUp') {
            setHighlightedIndex((prevIndex) => Math.max(prevIndex - 1, -1))
        } else if (event.key === 'Enter') {
            if (highlightedIndex < 0) return

            event.preventDefault()
            const selectedOption = filteredOptions[highlightedIndex]
            if (selectedOption) {
                setSelected(selectedOption)
                setHidden(true) // Ocultar resultados al seleccionar
            }
        } else if (event.key === 'Escape') {
            setHidden(true)
            setSelected(false)
            setName('')
            setFilteredOptions([])
            setProductList(null)
        }
    }

    // Función para manejar la selección de producto
    function handleProductSelect(product) {
        setSelected(product)
        setHidden(true) // Ocultar resultados al seleccionar
        setHighlightedIndex(-1) // Resetear índice destacado
    }

    // Función para limpiar la búsqueda
    function clearSearch() {
        setName('')
        setSelected(false)
        setHidden(true)
        setFilteredOptions([])
        setProductList(null)
        setHighlightedIndex(-1)
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    useEffect(() => {
        name && getProducts();
    }, [name]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)
            ) {
                setHidden(true)
                setHighlightedIndex(-1)
            }
        }

        const handleKeyUp = (e) => {
            if (e.key === 'Escape') {
                clearSearch()
            }
        }

        document.addEventListener("keyup", handleKeyUp)
        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
            document.removeEventListener("keyup", handleKeyUp)
        }
    }, [])

    useEffect(() => {
        if (optionRefs.current[highlightedIndex]) {
            optionRefs.current[highlightedIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }
    }, [highlightedIndex])

    return (
        <div className="order-search">
            <input
                type="search"
                ref={inputRef}
                placeholder="Buscar producto por nombre"
                className="input"
                value={name || ''}
                onChange={(e) => {
                    setName(e.target.value)
                    setHidden(false) // Mostrar resultados al escribir
                }}
                onFocus={(e) => {
                    if (e.target.value) {
                        setHidden(false) // Mostrar resultados si hay texto
                    }
                }}
                onKeyDown={handleKeyDown}
            />
            {name && !hidden && (
                <ul className="results" ref={dropdownRef}>
                    {productList ?
                        productList.length !== 0 ?
                            productList.map((product, index) => (
                                <li
                                    className={`product${highlightedIndex === index ? ' highlighted' : ''}`}
                                    key={product.id}
                                    onClick={() => handleProductSelect(product)}
                                    ref={(el) => (optionRefs.current[index] = el)}
                                >
                                    <img src={`${urlStorage}/${JSON.parse(product.thumbnails)[0]}`} />
                                    <p>
                                        {product.name}
                                        <span>${parseFloat(product.price)}</span>
                                    </p>
                                </li>
                            )) :
                            <li className="no-results">
                                <p>No se encontraron resultados</p>
                            </li>
                        :
                        <Loading />
                    }
                </ul>
            )}

            {selected &&
                <Modal onClose={() => {
                    setSelected(false)
                    clearSearch()
                }}>
                    <section className="section-form">
                        <form onSubmit={addProduct}>
                            <div className="header-form">
                                <h1>Agregar: {selected.name}</h1>
                                <p>Campos con <span>*</span> son obligatorios</p>
                            </div>
                            <div>
                                <div>
                                    <p>Cantidad <span>*</span></p>
                                    <input
                                        type="number"
                                        placeholder="Cantidad"
                                        className="input"
                                        name='quantity'
                                        required
                                        min="1"
                                    />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p>Descuento</p>
                                    <input
                                        type="number"
                                        placeholder="En porcentaje"
                                        className="input"
                                        name='discount'
                                        min="0"
                                        max="100"
                                    />
                                </div>
                            </div>
                            <div className="actions-edit">
                                <button type="submit" className="btn btn-solid">Agregar</button>
                                <button type="button" className="btn" onClick={() => {
                                    setSelected(false)
                                    clearSearch()
                                }}>Cancelar</button>
                            </div>
                        </form>
                    </section>
                </Modal>
            }
        </div>
    )
}