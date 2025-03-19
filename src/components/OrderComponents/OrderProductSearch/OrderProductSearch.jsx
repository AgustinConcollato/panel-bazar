import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { api } from "../../../services/api";
import { generateUUID } from "../../../utils/generateUUID";
import { Input } from "../Input/Input";
import './OrderProductSearch.css';

export function OrderProductSearch({ orderId, setOrderProducts }) {

    const [selected, setSelected] = useState({})
    const [price, setPrice] = useState()
    const [discount, setDiscount] = useState(0)
    const [reset, setReset] = useState(false)

    const { Order } = api

    function handleSelect(value) {
        setPrice(value.price)
        setSelected(value)
    }

    async function addProduct(e) {
        e.preventDefault()

        const orders = new Order()
        const formData = new FormData(e.target)

        const { thumbnails, id } = selected

        thumbnails && formData.append('picture', thumbnails)
        formData.append('product_id', id || generateUUID())
        formData.append('order_id', orderId)

        try {
            const product = await orders.add(formData)

            setOrderProducts(current => [...current, product])

            setReset(true)
            setPrice('')

            setTimeout(() => setReset(false), 1)

        } catch (error) {
            toast.error(error)
        }
    }

    return (
        !reset &&
        <form onSubmit={addProduct} className="search-order-product">
            <Input onSelect={handleSelect} setSelected={setSelected} />
            <input
                className="input"
                type="number"
                name="quantity"
                placeholder="Cantidad"
                min={0}
                required
            />
            <input
                className="input"
                type="number"
                name="price"
                placeholder="Precio"
                min={0}
                value={price}
                step={.01}
                onChange={(e) => setPrice(e.value)}
                required
            />
            <input
                className="input"
                type="number"
                name="discount"
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
            />
            <button type="submit" className="btn btn-regular"> Agregar <FontAwesomeIcon icon={faAngleRight} /></button>
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
        </form>
    )
}