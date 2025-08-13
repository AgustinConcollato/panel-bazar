import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { urlStorage } from "../../services/api"
import { Campaign } from "../../services/campaignServices"
import { Products } from "../../services/productsService"
import { CampaignProduct } from "../CampaignProduct/CampaignProduct"
import { Loading } from "../Loading/Loading"
import './CampaignProductList.css'

export function CampaignProductList({ campaign, setPage }) {

    const [selectedProducts, setSelectedProducts] = useState([])
    const [products, setProducts] = useState([])
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loadingDeleting, setLoadingDeleting] = useState(false)

    async function search(e) {
        const name = e.target.value.trim()

        if (name.length == 0) {
            setResults([])
            return
        }

        setLoading(true)
        try {
            const response = await new Products().search({ options: { name, page: 1, available_quantity: true } })
            setResults(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    async function addProductsToCampaign() {
        try {
            const response = await new Campaign().addProducts({ products: selectedProducts, campaignId: campaign.id })
            setProducts(response.products)
            setSelectedProducts([])
            setResults(null)
        } catch (error) {
            console.log(error)
        }
    }

    async function deleteProductsToCampaign(productId) {
        setLoadingDeleting(true)
        try {
            const response = await new Campaign().deleteProduct({ productId, campaignId: campaign.id })
            setProducts(currentProducts => currentProducts.filter(product => product.id !== response.product_id))
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingDeleting(false)
        }
    }

    function selectProduct(e) {

        const { id, name } = e

        const product = {
            campaign_id: campaign.id,
            product_id: id,
            custom_discount_type: campaign.discount_type,
            custom_discount_value: campaign.discount_value,
            name
        }

        setSelectedProducts(current => [...current, product])
    }

    useEffect(() => {
        setProducts(e => [...e, ...campaign.products.data])
    }, [campaign])

    return (
        <div className="campaign-products">
            <div>
                <input
                    type="search"
                    placeholder="Buscar productos"
                    className="input"
                    onChange={search}
                />
            </div>
            {!loading ?
                results && results.length > 0 ?
                    <div className="results">
                        {results.map(e => {
                            const isSelected = selectedProducts.find(p => p.product_id === e.id)
                            return (
                                <div
                                    key={e.id}
                                    className={`product ${(e.in_campaign || e.campaign_discount || e.campaign_info) ? 'product-in-campaign' : ''} ${isSelected ? 'product-select' : ''}`}
                                    onClick={() => !isSelected && !e.in_campaign && !e.campaign_discount && !e.campaign_info && selectProduct(e)}
                                >
                                    <div className="container-img">
                                        <img src={urlStorage + '/' + JSON.parse(e.thumbnails)[0]} />
                                    </div>
                                    <h4>{e.name}</h4>
                                </div>
                            )
                        }
                        )}
                    </div> :
                    <p>No hay resultados</p> :
                <p><Loading /></p>
            }
            {selectedProducts.length > 0 &&
                <div>
                    <h3>Seleccionados</h3>
                    <ul>
                        {selectedProducts.map(e =>
                            <li>
                                <span>{e.name}</span>
                                <FontAwesomeIcon icon={faXmark} onClick={() => setSelectedProducts(current => current.filter(f => f.product_id != e.product_id))} />
                            </li>
                        )}
                    </ul>
                    <button className="btn btn-solid" onClick={addProductsToCampaign}>Agregar seleccionados</button>
                </div>
            }
            <div>
                <h3>Productos que ya estan en "{campaign.name}"</h3>
                {products.length > 0 ?
                    <>
                        <div className="results">
                            {products.map(e =>
                                <CampaignProduct
                                    e={e}
                                    campaignId={campaign.id}
                                    onDelete={deleteProductsToCampaign}
                                    loadingDeleting={loadingDeleting}
                                />
                            )}
                        </div>
                        {products.length < campaign.products.total &&
                            <button className="btn btn-solid" onClick={() => setPage(e => e + 1)}>Ver más productos</button>
                        }
                    </> :
                    <div className="results">
                        <p>No hay productos</p>
                    </div>
                }
            </div>
        </div>
    )
}