import { useContext, useState } from "react";
import { url } from "../../../services/api";
import { Link, useParams } from "react-router-dom";
import { AppDataContext } from "../../../context/AppDataContext";
import { Loading } from "../../Loading/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export function Providers({ currentProviders }) {

    const { id } = useParams()
    const { providers } = useContext(AppDataContext)

    const [selectedProviders, setSelectedProviders] = useState({});
    const [providerList, setProviderList] = useState(currentProviders || null)


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

    return (
        providers ? (
            <div className="info-product" >
                <h3>Proveedores - Precios de compra</h3>
                <ul className="provider-list">
                    {providers.map((provider) => {
                        const existingProvider = providerList?.find(p => p.id === provider.id);
                        const hasPrice = existingProvider?.pivot?.purchase_price;

                        return (
                            <label htmlFor={provider.name}>
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
                    <form onSubmit={addPurchasePrice}>
                        {Object.keys(selectedProviders).length > 0 && (
                            <div>
                                {Object.keys(selectedProviders).map((providerId) => {
                                    const provider = providers.find((p) => p.id == providerId);
                                    return (
                                        <>
                                            <div className="purchase-price">
                                                <p>{provider.name}</p>
                                                <input
                                                    className="input"
                                                    type="number"
                                                    step={.01}
                                                    value={selectedProviders[providerId]}
                                                    onChange={(e) => handlePriceChange(providerId, e.target.value)}
                                                    placeholder="Ingrese el precio"
                                                />
                                                <button
                                                    type="button"
                                                    className="btn"
                                                    onClick={() => handlePriceChange(providerId, -1)}
                                                >
                                                    <FontAwesomeIcon icon={faXmark} size="xs" />
                                                </button>
                                            </div>
                                        </>
                                    );
                                })}
                                <button type="submit" className="btn btn-solid">Actualizar precios</button>
                            </div>
                        )}
                    </form>
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