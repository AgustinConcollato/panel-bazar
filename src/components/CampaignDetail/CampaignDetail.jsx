import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import { urlStorage } from "../../services/api"
import { Campaign } from "../../services/campaignServices"
import { formatDate } from "../../utils/formatDate"
import { CampaignProductList } from "../CampaignProductList/CampaignProductList"
import { Loading } from "../Loading/Loading"
import { Modal } from "../Modal/Modal"
import './CampaignDetail.css'

export function CampaignDetail() {

    const { slug } = useParams()

    const campaigns = new Campaign()

    const [campaign, setCampaing] = useState(null)
    const [edit, setEdit] = useState(null)

    async function updateCampign(data) {
        try {
            const response = await toast.promise(campaigns.update(campaign.id, data), {
                pending: 'Editando evento...',
                success: 'Se editó correctamente'
            })

            // Ajustar las fechas antes de actualizar el estado
            if (response.start_date) {
                const startDate = new Date(response.start_date);
                response.start_date = startDate.toISOString().split('T')[0];
            }
            if (response.end_date) {
                const endDate = new Date(response.end_date);
                response.end_date = endDate.toISOString().split('T')[0];
            }

            setCampaing(response)
            setEdit(null)
        } catch (error) {
            if (error.errors.end_date) {
                toast.error(error.errors.end_date[0])
            }
        }
    }

    function changeStatus(status) {
        updateCampign({ is_active: status ? '1' : '0' })
    }

    function changeCampaignData(e) {
        e.preventDefault()

        const formData = new FormData(e.target)
        const data = {}
        const errors = []

        // Procesar la imagen si existe
        const imageFile = formData.get('image')
        if (imageFile && imageFile.size > 0) {
            const reader = new FileReader()
            reader.onload = async (e) => {
                data.image = e.target.result // Esto será el base64
                processFormData(formData, data, errors)
            }
            reader.readAsDataURL(imageFile)
        } else {
            processFormData(formData, data, errors)
        }
    }

    function processFormData(formData, data, errors) {
        for (let [key, value] of formData.entries()) {
            if (value && key !== 'image') { 
                data[key] = value
            }
        }

        let hasChanges = false

        Object.entries(data).forEach(([key, value]) => {
            const currentValue = campaign[key] !== null ? campaign[key].toString().trim() : ''
            const newValue = value.toString().trim()

            if (currentValue === newValue) {
                let fieldName = getFieldName(key)
                errors.push(`El campo "${fieldName}" debe ser diferente`)
            } else {
                hasChanges = true
            }
        })

        if (!hasChanges) {
            errors.forEach(msg => toast.error(msg))
            return
        }

        updateCampign(data)
    }

    function getFieldName(key) {
        const map = {
            name: 'Nombre',
            description: 'Descripción',
            discount_type: 'Tipo de descuento',
            discount_value: 'Valor del descuento',
            start_date: 'Fecha de inicio',
            end_date: 'Fecha de finalización',
            image: 'Imagen'
        }

        return map[key] || key
    }

    function formatDateForInput(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    }

    async function getDetails() {

        try {
            const response = await campaigns.get({ slug })

            setCampaing(response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (slug) {
            setCampaing(null)
            getDetails()
        }
    }, [slug])

    if (!campaign) return <Loading />

    return (
        <>
            <section className="campaign-detail">
                <div className="campaign-detail-info">
                    <Link to={'/eventos'}><FontAwesomeIcon icon={faArrowLeft} /> Volver</Link>
                    <h2>
                        {campaign.name}
                        <p className={campaign.is_active ? 'active' : 'inactive'}><span></span>{campaign.is_active ? 'Activo' : 'Inactivo'}</p>
                    </h2>
                    <div>
                        <h4>Fechas</h4>
                        <div className="campaign-date">
                            <span>Inicio</span>
                            <span>{formatDate(campaign.start_date)}</span>
                        </div>
                        <div className="campaign-date">
                            <span>Fin</span>
                            <span>{formatDate(campaign.end_date)}</span>
                        </div>
                    </div>
                    <div>
                        <h4>Descuento</h4>
                        {campaign.discount_type ?
                            <div>
                                {campaign.discount_type == "fixed" ?
                                    <p>${campaign.discount_value}</p> :
                                    <p>{campaign.discount_value}%</p>
                                }
                            </div> :
                            <div>
                                <p>Sin descuentos</p>
                            </div>
                        }
                    </div>
                    <div>
                        <img src={`${urlStorage}/${campaign.image}`} className="campaign-image" />
                    </div>
                    <div>
                        <p>Ver en la web: <Link to={'https://bazarrshop.com/e/productos/' + campaign.slug} target="_blank">https://bazarrshop.com/e/productos/{campaign.slug}</Link></p>
                    </div>
                    <div className="container-btn">
                        <button className="btn" onClick={() => setEdit(true)}>Editar</button>
                        {campaign.is_active ?
                            <button className="btn btn-regular" onClick={() => changeStatus(false)}>Desactivar evento</button> :
                            <button className="btn btn-solid" onClick={() => changeStatus(true)}>Activar evento</button>
                        }
                    </div>
                </div>
                <CampaignProductList campaign={campaign} />
            </section>
            {edit &&
                <Modal>
                    <section className="container-children section-form">
                        <form onSubmit={changeCampaignData}>
                            <h2>Editar {campaign.name}</h2>
                            <div>
                                <div>
                                    <input type="file" name="image" />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p>Nombre</p>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Nombre"
                                        name="name"
                                        autoComplete="off"
                                        defaultValue={campaign.name}
                                    />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p>Descripción</p>
                                    <textarea
                                        type="text"
                                        name="description"
                                        className="input"
                                        placeholder="Descripción"
                                        defaultValue={campaign.description}
                                    />
                                </div>
                            </div>
                            <div>
                                <h3>Descuento</h3>
                                <div>
                                    <p>Tipo de descuento</p>
                                    <select name="discount_type" className="input" defaultValue={campaign.discount_type}>
                                        <option value="">Seleccionar tipo de descuento</option>
                                        <option value="percentage"> Porcentaje </option>
                                        <option value="fixed"> Cantidad de plata </option>
                                    </select>
                                </div>
                                <div>
                                    <p>Valor del Descuento</p>
                                    <input
                                        type="number"
                                        name="discount_value"
                                        className="input"
                                        placeholder="Valor del descuento"
                                        defaultValue={campaign.discount_value}
                                    />
                                </div>
                            </div>
                            <div>
                                <h3>Fechas</h3>
                                <div>
                                    <div>
                                        <p>Fecha de inicio</p>
                                        <input
                                            type="date"
                                            className="input"
                                            name="start_date"
                                            placeholder="Fecha de inicio"
                                            defaultValue={formatDateForInput(campaign.start_date)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <p>Fecha de finalización</p>
                                        <input
                                            type="date"
                                            className="input"
                                            name="end_date"
                                            placeholder="Fecha de finalización"
                                            defaultValue={formatDateForInput(campaign.end_date)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button type="submit" className="btn btn-solid">Guardar</button>
                                <button type="button" className="btn" onClick={() => setEdit(null)}>Cancelar</button>
                            </div>
                        </form>
                    </section>
                    <div className="background-modal" onClick={() => setEdit(null)}></div>
                </Modal>
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