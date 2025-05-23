import { useState, useEffect } from "react";
import { urlStorage } from "../../services/api";
import { Modal } from "../Modal/Modal";
import { Campaign } from "../../services/campaignServices";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { Loading } from "../Loading/Loading";
import './CampaignProduct.css'
import { toast } from "react-toastify";

export function CampaignProduct({ e, campaignId, onDelete }) {

    const [edit, setEdit] = useState()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setProduct(e)
        setEdit(false)
    }, [e])

    async function changeProduct(e) {
        e.preventDefault()

        const formData = new FormData(e.target)

        const data = {}

        for (let [key, value] of formData.entries()) {
            if (value) {
                data[key] = value
            }
        }

        const campaign = new Campaign()

        try {
            setLoading(true)

            if (!data.custom_discount_type && !data.custom_discount_value) {
                throw { error: 'Completa los campos' }
            }

            const response = await toast.promise(campaign.updateProduct({
                campaignId,
                productId: product.id,
                data
            }),
                {
                    pending: 'Editando...',
                    success: 'Editado correctamente'
                })


            setProduct(current => {
                current.pivot = response
                return current
            })

            setEdit(false)
        } catch (error) {
            toast.error(error.error)
        } finally {
            setLoading(false)
        }
    }

    if (!product) return <Loading />

    return (
        <>
            <div className="campaign-product" onClick={() => setEdit(true)}>
                <div className="container-img">
                    <img src={urlStorage + '/' + JSON.parse(product.thumbnails)[0]} />
                </div>
                <h4>{product.name}</h4>
                <span>Tipo:
                    {product.pivot.custom_discount_type == 'fixed' ?
                        ' Cantidad' :
                        product.pivot.custom_discount_type == 'percentage' ?
                            ' Porcentaje'
                            : ' -'}
                </span>
                <span>Valor:
                    {product.pivot.custom_discount_value ? (
                        product.pivot.custom_discount_type === "fixed" 
                            ? ` $${parseFloat(product.pivot.custom_discount_value).toLocaleString('es-AR', { maximumFractionDigits: 2 })}`
                            : ` ${parseFloat(product.pivot.custom_discount_value).toLocaleString('es-AR', { maximumFractionDigits: 2 })}%`
                    ) : ' -'}
                </span>
            </div >
            {edit &&
                <Modal>
                    <div className="container-children section-form">
                        <form onSubmit={changeProduct}>
                            <div className="header-form">
                                <h1>Editar {product.name}</h1>
                            </div>
                            <div>
                                <div>
                                    <p>Tipo de descuento</p>
                                    <select name="custom_discount_type" className="input" defaultValue={product.pivot.custom_discount_type}>
                                        <option value="">Seleccionar tipo de descuento</option>
                                        <option value="percentage"> Porcentaje </option>
                                        <option value="fixed"> Cantidad de plata </option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p>Valor del Descuento</p>
                                    <input
                                        type="number"
                                        name="custom_discount_value"
                                        className="input"
                                        placeholder="Valor del descuento"
                                        defaultValue={product.pivot.custom_discount_value}
                                    />
                                </div>
                            </div>
                            <div>
                                <button type="submit" className="btn btn-solid" disabled={loading} >{loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Guardar'}</button>
                                <button type="button" className="btn" onClick={() => setEdit(false)}>Cancelar</button>
                                <button type="button" className="btn btn-error-regular" onClick={() => onDelete(product.id)}>Eliminar del evento</button>
                            </div>
                        </form>
                    </div>
                    <div className="background-modal" onClick={() => setEdit(false)}></div>
                </Modal>
            }
        </>
    )
}