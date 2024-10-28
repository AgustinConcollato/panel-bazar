import { useParams } from "react-router-dom"
import { api, urlStorage as url } from "../../services/api"
import { useEffect, useState } from "react"
import { Loading } from "../Loading/Loading"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons"
import '../ProductDetail.css'

export function ProductDetail() {

    const { id } = useParams()
    const { products } = api

    const [product, setProduct] = useState(null)
    const [error, setError] = useState(null)
    const [images, setImages] = useState([])
    const [thumbnails, setThumbnails] = useState([])
    const [position, setPosotion] = useState(null)

    async function getDetails() {
        try {
            const response = await products.search({ id })

            const { product, message, status } = response

            if (status == 'error') throw new Error(message);

            setProduct(product)

            const { images, thumbnails } = product

            setImages(JSON.parse(images))
            setThumbnails(thumbnails != "" ? JSON.parse(thumbnails) : [])

        } catch (error) {
            setProduct({})
            setError(error.message)
        }
    }

    useEffect(() => {
        getDetails()
    }, [id])

    return (
        <>
            {!product ?
                <Loading /> :
                error ?
                    <span>{error}</span> :
                    <section className="product-detail">
                        <div className="container-images">
                            {position != null && <img src={url + '/' + images[position]} alt="" />}
                            <div className="container-thumbnails">
                                {thumbnails.map((e, i) => <img src={url + '/' + e} style={position == i ? { outline: '1px solid #3d6caa' } : {}} onClick={() => setPosotion(i)} />)}
                            </div>
                        </div>
                        <div className="info-product">
                            <h1>{product.name}</h1>
                            <ul>
                                <li>Código de referencia <b>{product.code}</b></li>
                                <li>Precio <b>${product.price}</b></li>
                                <li>Descuento <b>{product.discount}</b></li>
                                {product.description && <li>Descripción: <b>{product.description}</b></li>}
                            </ul>
                            <div className="actions">
                                <button className="btn"><FontAwesomeIcon icon={faPenToSquare} /> Editar</button>
                                <button className="btn"><FontAwesomeIcon icon={faTrashCan} /> Editar</button>
                            </div>
                        </div>
                    </section>
            }
        </>
    )
}