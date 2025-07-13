import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AppDataContext } from "../../../context/AppDataContext";
import { AngleDownIcon } from "../../../icons/icons";
import { api } from "../../../services/api";
import { Loading } from "../../Loading/Loading";
import { Modal } from "../../Modal/Modal";
import './ProductProviders.css';

export function Providers({ currentProviders }) {
    const { id } = useParams();
    const { providers } = useContext(AppDataContext);

    const [selectedProviders, setSelectedProviders] = useState({});
    const [providerList, setProviderList] = useState(currentProviders || null);
    const [btnHidden, setBtnHidden] = useState(true);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Selección y edición de proveedor
    function handleSelectProvider(providerId) {
        setSelectedProviders((prev) => {
            const updated = { ...prev };
            if (updated[providerId]) {
                delete updated[providerId];
            } else {
                // Si ya existe en providerList, precargar valores
                const existing = providerList?.find(p => p.id === providerId);
                updated[providerId] = {
                    purchase_price: existing?.pivot?.purchase_price || '',
                    provider_url: existing?.pivot?.provider_url || '',
                };
            }
            return updated;
        });
    }

    function handleProviderFieldChange(providerId, field, value) {
        setSelectedProviders((prev) => ({
            ...prev,
            [providerId]: {
                ...prev[providerId],
                [field]: value,
            },
        }));
    }

    async function addPurchasePrice(e) {
        e.preventDefault();
        // Filtrar solo los que tengan precio válido (>0)
        const filteredProviders = Object.fromEntries(
            Object.entries(selectedProviders).filter(
                ([_, data]) => parseFloat(data.purchase_price) > 0
            )
        );
        if (Object.keys(filteredProviders).length > 0) {
            setLoading(true);
            const { Providers } = api;
            const providersApi = new Providers();
            const formData = new FormData();
            formData.append('providers', JSON.stringify(filteredProviders));
            formData.append('product_id', id);
            try {
                const product = await toast.promise(providersApi.assignProduct(formData), {
                    pending: 'Actualizando proveedor...',
                    success: 'Se actualizó correctamente',
                    error: 'Error, no se pudo actualizar',
                });
                setProviderList(product.product.providers);
                setSelectedProviders({});
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        } else {
            toast.info('No hay cambios para guardar');
        }
    }

    async function deleteProvider(providerId) {
        setDeleteLoading(true);
        const { Providers } = api;
        const providersApi = new Providers();
        try {
            const response = await toast.promise(providersApi.deleteProduct({ providerId, productId: id }), {
                pending: 'Eliminando relación...',
                success: 'Se eliminó correctamente',
                error: 'Error, no se pudo eliminar',
            });
            setProviderList(response.providers);
            setSelectedProviders({});
            setBtnHidden(true);
        } catch (error) {
            console.log(error);
        } finally {
            setDeleteLoading(false);
        }
    }

    useEffect(() => {
        const handleKeyUp = (e) => {
            if (e.keyCode === 27) {
                setSelectedProviders({});
            }
        };
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return providers ? (
        <div className="info-product">
            <h3>Proveedores - Precios de compra</h3>
            <ul className="provider-list">
                {providers.map((provider) => {
                    const existingProvider = providerList?.find(p => p.id === provider.id);
                    const hasPrice = existingProvider?.pivot?.purchase_price;
                    const hasUrl = existingProvider?.pivot?.provider_url;
                    return (
                        <label htmlFor={provider.name} key={provider.id}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span>
                                    <input
                                        id={provider.name}
                                        type="checkbox"
                                        onChange={() => handleSelectProvider(provider.id)}
                                        checked={!!selectedProviders[provider.id]}
                                    />
                                    {provider.name}
                                </span>                                
                                {hasUrl && (
                                    <Link to={hasUrl} target="_blank" rel="noopener noreferrer">
                                        [Ver URL]
                                    </Link>
                                )}
                                {hasPrice ? <b>${parseFloat(hasPrice).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</b> : '-'}
                            </li>
                        </label>
                    );
                })}
            </ul>
            {providers.length !== 0 ? (
                Object.keys(selectedProviders).length > 0 && (
                    <Modal onClose={() => setSelectedProviders({})}>
                       <div className="section-form">
                         <form onSubmit={addPurchasePrice}>
                            {Object.keys(selectedProviders).map((providerId) => {
                                const provider = providers.find((p) => p.id == providerId);
                                const values = selectedProviders[providerId];
                                return (
                                    <div key={providerId}>
                                        <h2>{provider.name}</h2>
                                        <div className="purchase-price">
                                            <p>Precio</p>
                                            <div>
                                                <input
                                                    className="input"
                                                    type="number"
                                                    step={0.01}
                                                    min={0}
                                                    onChange={e => handleProviderFieldChange(providerId, 'purchase_price', e.target.value)}
                                                    placeholder="Ingrese el precio"
                                                    value={values.purchase_price}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="provider-url">
                                            <p>URL</p>
                                            <div>
                                                <input
                                                    className="input"
                                                    type="url"
                                                    onChange={e => handleProviderFieldChange(providerId, 'provider_url', e.target.value)}
                                                    placeholder="URL del proveedor (opcional)"
                                                    value={values.provider_url}
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" disabled={loading} className="btn btn-solid" style={{ marginTop: 8 }}>
                                            {loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Actualizar'}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={() => setSelectedProviders(prev => { const copy = { ...prev }; delete copy[providerId]; return copy; })}
                                            style={{ marginLeft: 8 }}
                                        >
                                            Cancelar
                                        </button>
                                        {providerList?.find(p => p.id == providerId) && (
                                            <div className="delete-provider">
                                                <p onClick={() => setBtnHidden(!btnHidden)}>
                                                    Eliminar relación con "{provider.name}" <AngleDownIcon width={18} height={18} color={'#000'} />
                                                </p>
                                                {!btnHidden && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-error-regular"
                                                        onClick={() => deleteProvider(provider.id)}
                                                        disabled={deleteLoading}
                                                    >
                                                        {deleteLoading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Eliminar'}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </form>
                       </div>
                    </Modal>
                )
            ) : (
                <div>
                    <p style={{ fontSize: '16px' }}>No hay proveedores agregados</p>
                    <Link to={'/agregar-proveedor'} className="btn btn-regular" style={{ width: '100%' }}>
                        Agregar proveedor
                    </Link>
                </div>
            )}
        </div>
    ) : (
        <div>
            <Loading />
        </div>
    );
}