import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Address } from "../../services/addressService";
import './NewAddress.css';
import { toast } from "react-toastify";

export function NewAddress({ setAddresses, total, onClose, client }) {

    const provinceList = [
        "Ciudad Autónoma de Buenos Aires",
        "Neuquén",
        "San Luis",
        "Santa Fe",
        "La Rioja",
        "Catamarca",
        "Tucumán",
        "Chaco",
        "Formosa",
        "Santa Cruz",
        "Chubut",
        "Mendoza",
        "Entre Ríos",
        "San Juan",
        "Jujuy",
        "Santiago del Estero",
        "Río Negro",
        "Corrientes",
        "Misiones",
        "Salta",
        "Córdoba",
        "Buenos Aires",
        "La Pampa",
        "Tierra del Fuego, Antártida e Islas del Atlántico Sur"
    ]

    const [province, setProvince] = useState(null)
    const [city, setCity] = useState(null)
    const [postalCode, setPostalCode] = useState(null)
    const [address, setAddress] = useState(null)
    const [number, setNumber] = useState(null)
    const [loading, setLoading] = useState(false)

    function selectProvince(e) {
        const value = e.target.value

        setProvince(null)
        setTimeout(() => {
            setProvince(value)
        }, 10)

        setCity(null)
        setAddress(null)
        setNumber(null)
        setPostalCode(null)
    }

    async function addAddress(e) {
        e.preventDefault()

        if (!client || !client.id) {
            toast.error('No se encontró el cliente.');
            setLoading(false);
            return;
        }

        if(!province) {
            return toast.error('Debe seleccionar una provincia');
        }
        
        if(!city) {
            return toast.error('Debe completar la localidad');
        }

        if(!postalCode) {
            return toast.error('Debe completar el código postal');
        }

        if(!address) {
            return toast.error('Debe completar la calle');
        }

        if(!number) {
            return toast.error('Debe completar la altura');
        }

        const a = new Address(client.id)

        setLoading(true)

        try {
            const status = total == 0 ? 'selected' : null
            const addressCreated = await toast.promise(a.add({
                client_id: client.id,
                province,
                city,
                address,
                address_number: number,
                zip_code: postalCode,
                status
            }), {
                pending: 'Agregando...',
                success: 'Agregada correctamente',
                error: 'Error, no se puedo agregar la dirección'
            })

            if (addressCreated) {
                setAddresses(e => [...e, addressCreated])
                onClose(false)
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={addAddress} className="form-new-address">
            <h2>Nueva dirección</h2>
            <select className="input" name="province" onChange={selectProvince}>
                <option value="">Selecciona una provincia</option>
                {provinceList.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            {province &&
                <div className="div-street">
                    <div className="input-address">
                        <input
                            type="text"
                            onChange={(e) => {
                                if (e.target.value == '') {
                                    setNumber(null)
                                    setAddress(null)
                                }
                                setCity(e.target.value)
                            }
                            }
                            placeholder="Localidad"
                            className="input"
                            autoComplete="off"
                        />
                    </div>
                    <div className="input-address">
                        <input
                            type="text"
                            onChange={(e) => {
                                if (e.target.value == '') {
                                    setNumber(null)
                                    setAddress(null)
                                }
                                setPostalCode(e.target.value)
                            }
                            }
                            placeholder="Código Postal"
                            className="input"
                            autoComplete="off"
                        />
                    </div>
                </div>
            }
            {city && postalCode &&
                <div className="div-street">
                    <div className="input-address">
                        <input
                            type="text"
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Calle"
                            className="input"
                            autoComplete="off"
                        />
                    </div>
                    <div className="input-address">
                        <input
                            type="text"
                            placeholder="Altura"
                            onChange={({ target }) => setNumber(target.value)}
                            className="input"
                            autoComplete="off"
                        />
                    </div>
                </div>}
            <button
                type="submit"
                disabled={loading}
                className={"btn btn-solid"}
            >
                {loading ? <FontAwesomeIcon icon={faCircleNotch} spin/> : 'Agregar'}
            </button>
            <button type="button" className="btn" onClick={()=> onClose(false)}>Cancelar</button>
        </form>
    )
}