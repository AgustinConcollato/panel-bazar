import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppDataContext } from "../../../context/AppDataContext";
import { AngleDownIcon } from "../../../icons/icons";
import { api, url } from "../../../services/api";
import { Loading } from "../../Loading/Loading";
import { Modal } from "../../Modal/Modal";
import './ProductProviders.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

export function Providers({ currentProviders }) {

    const { id } = useParams()
    const { providers } = useContext(AppDataContext)

    const [selectedProviders, setSelectedProviders] = useState({});
    const [providerList, setProviderList] = useState(currentProviders || null)
    const [price, setPrice] = useState(null)
    const [btnHidden, setBtnHidden] = useState(true)
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

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
        setPrice(null)
        setSelectedProviders((prev) => {
            // Si el precio es 0, eliminamos el proveedor
            if (price < 0) {
                const newSelectedProviders = { ...prev };
                delete newSelectedProviders[providerId]; // Eliminar el proveedor
                setPrice(null)
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
            Object.entries(selectedProviders).filter(([_, price]) => price > 0)
        )

        formData.append('providers', JSON.stringify(filteredProviders))
        formData.append('product_id', id)

        if (Object.keys(filteredProviders).length > 0) {
            setLoading(true)

            const { Providers } = api
            const providers = new Providers()

            try {

                const product = await toast.promise(providers.assignProduct(formData), {
                    pending: 'Actualizando precio...',
                    success: 'Se actualizó correctamente',
                    error: 'Error, no se puedo actualizar'
                })

                setProviderList(product.product.providers)
                setSelectedProviders({})
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
                setPrice(null)
            }
        } else {
            toast.info('No hay cambios para guardar')
        }

    }

    async function deleteProvider(providerId) {
        setDeleteLoading(true)

        const { Providers } = api
        const providers = new Providers()

        try {
            const response = await toast.promise(providers.deleteProduct({ providerId, productId: id }), {
                pending: 'Eliminando relación...',
                success: 'Se eliminó correctamente',
                error: 'Error, no se puedo eliminar'
            })

            setProviderList(response.providers)
            setSelectedProviders({})
            setBtnHidden(true)

        } catch (error) {
            console.log(error)
        } finally {
            setDeleteLoading(false)
        }

        setPrice(null)
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
                                    {hasPrice ? <b>${parseFloat(hasPrice).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</b> : '-'}
                                </li>
                            </label>
                        );
                    })}
                </ul>
                {providers.length !== 0 ? (
                    Object.keys(selectedProviders).length > 0 && (
                        <Modal onClose={() => setSelectedProviders({})}>
                            <form onSubmit={addPurchasePrice}>
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
                                                    value={price}
                                                    defaultValue={hasPrice}
                                                    required
                                                />
                                            </div>
                                            <button type="submit" disabled={loading} className="btn btn-solid">{loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Actualizar precio'}</button>
                                            <button
                                                type="button"
                                                className="btn"
                                                onClick={() => handlePriceChange(providerId, -1)}
                                            >
                                                Cancelar
                                            </button>
                                            {hasPrice &&
                                                <div className="delete-provider">
                                                    <p onClick={() => setBtnHidden(!btnHidden)}>Eliminar relación con "{provider.name}" <AngleDownIcon width={18} height={18} color={'#000'} /> </p>
                                                    {!btnHidden &&
                                                        <button
                                                            type="button"
                                                            className="btn btn-error-regular"
                                                            onClick={() => deleteProvider(provider.id)}
                                                            disabled={deleteLoading}
                                                        >
                                                            {deleteLoading ?
                                                                <FontAwesomeIcon icon={faCircleNotch} spin /> :
                                                                'Eliminar'
                                                            }
                                                        </button>
                                                    }
                                                </div>
                                            }
                                        </>
                                    );
                                })}

                            </form>
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