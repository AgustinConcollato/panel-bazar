import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppDataContext } from "../../../context/AppDataContext";
import { AngleDownIcon } from "../../../icons/icons";
import { api, url } from "../../../services/api";
import { Loading } from "../../Loading/Loading";
import { Modal } from "../../Modal/Modal";
import './ProductProviders.css';

export function Providers({ currentProviders }) {

    const { id } = useParams()
    const { providers } = useContext(AppDataContext)

    const [selectedProviders, setSelectedProviders] = useState({});
    const [providerList, setProviderList] = useState(currentProviders || null)
    const [price, setPrice] = useState(null)
    const [btnHidden, setBtnHidden] = useState(true)

    function handleSelectProvider(providerId) {
        setSelectedProviders((prev) => {
            const updated = { ...prev };

            if (updated[providerId]) {
                delete updated[providerId]; // Si ya está seleccionado, lo eliminamos
            } else {
                updated[providerId] = ''; // Agregamos un campo vacío para el precio
            }

            return updated;
        });
    }

    function handlePriceChange(providerId, price) {
        setSelectedProviders((prev) => {
            // Si el precio es 0, eliminamos el proveedor
            if (price < 0) {
                const newSelectedProviders = { ...prev };
                delete newSelectedProviders[providerId]; // Eliminar el proveedor
                return newSelectedProviders;
            }

            // Si el precio no es 0, actualizamos el proveedor
            return {
                ...prev,
                [providerId]: price,
            };
        });
    }

    async function addPurchasePrice(e) {
        e.preventDefault()
        const formData = new FormData(e.target)

        const filteredProviders = Object.fromEntries(
            Object.entries(selectedProviders).filter(([providerId, price]) => price > 0)
        )

        formData.append('providers', JSON.stringify(filteredProviders))
        formData.append('product_id', id)

        try {
            const response = await fetch(`${url}/provider/assign-product`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: formData
            })

            if (!response.ok) {
                const error = await response.json()
                throw error
            }

            const product = await response.json()

            setProviderList(product.product.providers)
            setSelectedProviders({})
        } catch (error) {
            console.log(error)
        }

    }

    async function deleteProvider(providerId) {
        const { Providers } = api

        const providers = new Providers()

        try {

            const response = await providers.deleteProduct({ providerId, productId: id })

            console.log(response)

            setProviderList(response.providers)
            setSelectedProviders({})
            setBtnHidden(true)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const handleKeyUp = (e) => {
            if (e.keyCode === 27) {
                setSelectedProviders({})
            }
        };

        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return (
        providers ? (
            <div className="info-product" >
                <h3>Proveedores - Precios de compra</h3>
                <ul className="provider-list">
                    {providers.map((provider) => {
                        const existingProvider = providerList?.find(p => p.id === provider.id);
                        const hasPrice = existingProvider?.pivot?.purchase_price;
                        return (
                            <label htmlFor={provider.name} key={provider.id}>
                                <li key={provider.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <span>
                                        <input
                                            id={provider.name}
                                            type="checkbox"
                                            onChange={() => handleSelectProvider(provider.id)}
                                            checked={!!selectedProviders[provider.id]}
                                        />
                                        {provider.name}
                                    </span>
                                    {hasPrice ? <b>${hasPrice}</b> : '-'}
                                </li>
                            </label>
                        );
                    })}
                </ul>
                {providers.length !== 0 ? (
                    Object.keys(selectedProviders).length > 0 && (
                        <Modal>
                            <form onSubmit={addPurchasePrice} className="container-children">
                                <div>
                                    {Object.keys(selectedProviders).map((providerId) => {
                                        const provider = providers.find((p) => p.id == providerId);
                                        const existingProvider = providerList?.find(p => p.id === provider.id);
                                        const hasPrice = existingProvider?.pivot?.purchase_price;

                                        return (
                                            <>
                                                <h2>{provider.name}</h2>
                                                <div className="purchase-price">
                                                    <input
                                                        className="input"
                                                        type="number"
                                                        step={.01}
                                                        onChange={(e) => {
                                                            handlePriceChange(providerId, e.target.value)
                                                            setPrice(e.target.value)
                                                        }}
                                                        placeholder="Ingrese el precio"
                                                        value={price || hasPrice || ''}
                                                        required
                                                    />
                                                </div>
                                                <div className="actions-edit">

                                                    <button
                                                        type="button"
                                                        className="btn"
                                                        onClick={() => handlePriceChange(providerId, -1)}
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button type="submit" className="btn btn-solid">Actualizar precio</button>
                                                </div>
                                                {hasPrice &&
                                                    <div className="delete-provider">
                                                        <p onClick={() => setBtnHidden(!btnHidden)}>Eliminar relación con "{provider.name}" <AngleDownIcon width={18} height={18} color={'#000'} /> </p>
                                                        {!btnHidden &&
                                                            <button
                                                                type="button"
                                                                className="btn btn-error-regular"
                                                                onClick={() => deleteProvider(provider.id)}
                                                            >
                                                                Eliminar
                                                            </button>
                                                        }
                                                    </div>
                                                }
                                            </>
                                        );
                                    })}

                                </div>
                            </form>
                            <div className="background-modal" onClick={() => setSelectedProviders({})}></div>
                        </Modal>)
                ) : (
                    <div>
                        <p style={{ fontSize: "16px" }}>No hay proveedores agregados</p>
                        <Link to={"/agregar-proveedor"} className="btn btn-regular" style={{ width: "100%" }}>
                            Agregar proveedor
                        </Link>
                    </div>
                )}
            </div>
        ) : (
            <div>
                <Loading />
            </div>
        )
    );
}