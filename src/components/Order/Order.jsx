import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { api } from "../../services/api"
import { Loading } from "../Loading/Loading"
import './Order.css'
import { SearchOrderProduct } from "../SearchOrderProduct/SearchOrderProduct"

export function Order() {

    const { Order } = api
    const { id } = useParams()
    const [orderData, setOrderData] = useState(null)
    const [orderProducts, setOrderProducts] = useState(null)

    async function getOrder(orderId) {
        const order = new Order()
        try {
            const response = await order.get(orderId)
            console.log(response)

            setOrderData(response)
            setOrderProducts(response.products)
        } catch (error) {
            console.log(error.message)
        }

    }

    function addProductOrder() {

    }

    function removeProductOrder() {

    }

    function updateOrder() {

    }

    useEffect(() => {
        getOrder(id)
    }, [id])

    if (!orderData) return <Loading />

    return (
        <section className="order">
            <div>
                <h3>{orderData.client_name}</h3>
            </div>
            {orderProducts ?
                orderProducts.length != 0 ?
                    <div>lista de productos</div> :
                    <div>
                        <p>No hay productos</p>
                        <SearchOrderProduct orderId={id} />
                    </div> :
                <Loading />
            }
        </section>
    )
}