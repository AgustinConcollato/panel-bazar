import { useState } from 'react'
import { Campaign } from '../../services/campaignServices'
import './AddCampaign.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch, faXmark } from '@fortawesome/free-solid-svg-icons'
import { toast, ToastContainer } from 'react-toastify'
import { DragAndDrop } from '../DragAndDrop/DragAndDrop'

export function AddCampaign() {

    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState([])
    const [forceActive, setForceActive] = useState(false)

    async function addCampaign(e) {
        e.preventDefault()

        const formData = new FormData(e.target)
        formData.append('image', image[0])
        formData.set('force_active', forceActive ? '1' : '0')

        const campaign = new Campaign()

        try {
            setLoading(true)
            const response = await toast.promise(campaign.add(formData), {
                pending: 'Agregando evento...',
                success: 'Se agregó correctamente'
            })

            if (response) {
                e.target.reset()
                setImage([])
                setForceActive(false)
            }

        } catch (error) {

            if (error.errors) {
                if (error.errors.end_date) {
                    toast.error(error.errors.end_date[0])
                }

                if (error.errors.start_date) {
                    toast.error(error.errors.start_date[0])
                }

                if (error.errors.name) {
                    toast.error('Error, falta agregar el nombre del evento')
                }

                if (error.errors.image) {
                    if (error.errors.image[0] == "The image field must not be greater than 2048 kilobytes.") {
                        toast.error('Error, la imagen no debe pesar mas de 2MB')
                    } else {
                        toast.error('Error, falta agregar la imagen')
                    }
                }
            }

            toast.error(error.error)

        } finally {
            setLoading(false)
        }

    }

    return (
        <section className="section-form add-campaign">
            <form onSubmit={addCampaign}>
                <div className="header-form">
                    <h1>Nuevo evento o campaña</h1>
                    <p>Los campos con <span>*</span> son obligatorios</p>
                </div>
                <div>
                    <h3>Imagen del evento <span>*</span></h3>
                    <div className="selected-images">
                        <DragAndDrop setImages={setImage} />
                    </div>
                    <div>
                        {image.length > 0 &&
                            <div className="preview-images">
                                <div>
                                    <span onClick={() => setImage([])}><FontAwesomeIcon icon={faXmark} /></span>
                                    <img src={URL.createObjectURL(image[0])} />
                                </div>
                            </div>
                        }
                    </div>
                    <div>
                        <p>Nombre <span>*</span></p>
                        <input
                            type="text"
                            className="input"
                            placeholder="Nombre"
                            name="name"
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
                        />
                    </div>
                </div>
                <div>
                    <h3>Descuento</h3>
                    <div>
                        <p>Tipo de descuento</p>
                        <select name="discount_type" className="input">
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
                        />
                    </div>
                </div>
                <div className="checkbox-field">
                    <label>
                        <input
                            type="checkbox"
                            name="force_active"
                            checked={forceActive}
                            onChange={(e) => setForceActive(e.target.checked)}
                        />
                        Activar evento sin fechas de inicio y finalización
                    </label>
                </div>
                {!forceActive &&
                    <div>
                        <h3>Fechas <span>*</span></h3>
                        <div>
                            <div>
                                <p>Fecha de inicio</p>
                                <input
                                    type="date"
                                    className="input"
                                    name="start_date"
                                    placeholder="Fecha de inicio"
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
                                />
                            </div>
                        </div>
                    </div>
                }
                <button
                    disabled={loading}
                    className='btn btn-solid'
                    type='submit'
                >
                    {loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Agregar'}
                </button>
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