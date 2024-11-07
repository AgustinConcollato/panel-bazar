import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchInput } from "../SearchInput/SearchInput";
import './SearchOrderProduct.css'
import { useState } from "react";
import { api } from "../../services/api";

export function SearchOrderProduct({ orderId }) {

    const [selected, setSelected] = useState()
    const [price, setPrice] = useState()

    const { Order } = api

    function handleSelect(value) {
        console.log('Seleccionado:', value);
        setPrice(value.price)
        setSelected(value)
    }

    function addProduct(e) {
        e.preventDefault()

        const orders = new Order()
        const formData = new FormData(e.target)

        const { thumbnails = '', id } = selected

        formData.append('picture', thumbnails)
        formData.append('product_id', id)
        formData.append('order_id', orderId)

        orders.add(formData)
    }

    return (
        <form onSubmit={addProduct} className="search-order-product">
            <input
                className="input"
                type="number"
                name="quantity"
                placeholder="Cantidad"
                min={0}
                required
            />
            <SearchInput onSelect={handleSelect} />
            <input
                className="input"
                type="number"
                name="price"
                placeholder="precio"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.value)}
                required
            />
            <button type="submit" className="btn btn-regular"> Agregar <FontAwesomeIcon icon={faAngleRight} /></button>
        </form>
    )
}