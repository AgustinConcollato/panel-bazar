import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { Campaign } from "../../services/campaignServices"
import { Loading } from "../Loading/Loading"
import { formatDate } from "../../utils/formatDate"
import './CampaignList.css'

export function CampaignList() {

    const [campaignList, setCampaignList] = useState(null)

    async function getCampaing() {
        const campaign = new Campaign()

        try {
            const response = await campaign.get({ })
            setCampaignList(response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCampaing()
    }, [])

    if (!campaignList) return <Loading />

    return (
        campaignList?.length > 0 ?
            <ul className="campaign-list">
                {campaignList.map(e =>
                    <li>
                        <NavLink to={'/eventos/' + e.slug}>
                            <h3>{e.name}</h3>
                            <div>
                                <span>Inicio</span>
                                <span>{formatDate(e.start_date)}</span>
                            </div>
                            <div>
                                <span>Fin</span>
                                <span>{formatDate(e.end_date)}</span>
                            </div>
                            <p className={e.is_active ? 'active' : 'inactive'}><span></span>{e.is_active ? 'Activo' : 'Inactivo'}</p>
                            {e.discount_type ?
                                <div>
                                    {e.discount_type == "fixed" ?
                                        <p>${e.discount_value}</p> :
                                        <p>{e.discount_value}%</p>
                                    }
                                </div> :
                                <div>
                                    <p>Sin descuentos</p>
                                </div>
                            }
                        </NavLink>
                    </li>
                )}
            </ul> :
            <p>no hay eventos creados</p>
    )
}