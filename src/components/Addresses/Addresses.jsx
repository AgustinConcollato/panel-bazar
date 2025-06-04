import { faCircleNotch, faLocationDot, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { Address } from "../../services/addressService"
import { Loading } from "../Loading/Loading"
import { NewAddress } from "../NewAddress/NewAddress"
import './Addresses.css'

export function Addresses({ client, type, onChange }) {

    const address = new Address(client.id)

    const [addresses, setAddresses] = useState(null)
    const [selected, setSelected] = useState(0)
    const [formNewAddress, setFormNewAddress] = useState(false)
    const [loading, setLoading] = useState(false)
    const [confirmOrder, setConfirmOrder] = useState(false)

    async function getAddress() {

        try {
            const response = await address.get()

            response.forEach((e) => {
                if (type == 'MODAL' && localStorage.getItem('address')) {
                    const sessionAddress = localStorage.getItem('address')
                    e.id == JSON.parse(sessionAddress).id && setSelected(e)
                    return
                }

                e.status && setSelected(e)
            });

            setConfirmOrder(response.length == 1)

            setAddresses(response)
        } catch (error) {
            setAddresses([])
            localStorage.removeItem('address')
            return
        }
    }

    async function saveAddrees(e) {
        try {
            const response = await address.save(e)
            setAddresses(response)
        } catch (error) {
            console.log(error)
        }
    }

    async function deleteAddress(e) {
        setLoading(true)
        try {
            const response = await address.delete(e)
            setAddresses(response)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAddress(client.id)
    }, [])

    useEffect(() => {
        if (addresses && addresses.length === 1) {
            !confirmOrder && onChange(addresses[0])
        }
    }, [addresses])

    return (
        addresses ?
            <div className="addresses">
                <h4>Direcciones</h4>
                {addresses.length != 0 ?
                    <div className="container-address">
                        {addresses.map(e =>
                            type == 'PROFILE' ?
                                <AddressListProfile
                                    e={e}
                                    selected={selected}
                                    setSelected={setSelected}
                                /> :
                                <AddressListModal
                                    e={e}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                        )}
                    </div> :
                    <div className="not-addresses">
                        <p>No hay direcciones registradas</p>
                    </div>
                }
                <div className="container-btn-change-address">
                    {addresses.map(e =>
                        <>
                            {(e.status != 'selected' && e.id == selected.id) &&
                                <button
                                    style={{ order: 0 }}
                                    className="btn btn-solid"
                                    onClick={() => {
                                        saveAddrees(selected)
                                        type == 'MODAL' && onChange(selected)
                                    }}
                                >
                                    Cambiar dirección principal
                                </button>
                            }
                            {(e.id == selected.id && type == 'MODAL') &&
                                JSON.parse(localStorage.getItem('address'))?.id != selected.id &&
                                <button
                                    style={{ order: 1 }}
                                    className="btn"
                                    onClick={() => {
                                        localStorage.setItem('address', JSON.stringify(selected))
                                        onChange(selected)
                                    }}
                                >
                                    Cambiar solo para este pedido
                                </button>
                            }
                            {(e.id == selected.id && type == 'PROFILE') &&
                                <button
                                    style={{ order: 2 }}
                                    className="btn btn-error-regular"
                                    onClick={() => deleteAddress(e.id)}
                                >
                                    {loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Eliminar dirección'}
                                </button>
                            }

                        </>
                    )}
                </div>
                    <NewAddress
                        setAddresses={setAddresses}
                        onClose={setFormNewAddress}
                        total={addresses?.length}
                        client={client}
                    />
            </div> :
            <Loading />
    )
}

function AddressListProfile({ e, selected, setSelected }) {
    return (
        <div
            key={e.id}
            onClick={() => setSelected(e)}
            className={
                selected.id == e.id ?
                    'address address-selected' :
                    'address'
            }
        >
            <FontAwesomeIcon icon={faLocationDot} />
            <div>
                <p>{e.address} {e.address_number}</p>
                <p>{e.city}, {e.province}</p>
            </div>
        </div>
    )
}

function AddressListModal({ e, selected, setSelected }) {
    return (
        <div
            key={e.id}
            onClick={() => setSelected(e)}
            className={
                (selected.id == e.id && !localStorage.getItem('address')) ?
                    'address address-selected' :
                    (e.id == selected.id) ?
                        'address address-selected' :
                        'address'
            }
        >
            <FontAwesomeIcon icon={faLocationDot} />
            <div>
                <p>{e.address} {e.address_number}</p>
                <p>{e.city}, {e.province}</p>
            </div>
        </div>
    )
}