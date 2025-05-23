import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { CampaignList } from '../../components/CampaignList/CampaignList'
import { CampaignDetail } from '../../components/CampaignDetail/CampaignDetail'
import './CampaignPage.css'

export function CampaignPage() {
    return (
        <section className='campaign-page'>

            <Routes>
                <Route path='/' element={
                    <>
                        <div className="header-campaign-page">
                            <Link to={'/agregar-evento'} className="btn btn-solid">+ Nuevo evento </Link>
                        </div>
                        <CampaignList />
                    </>
                } />
                <Route path='/:slug?' element={<CampaignDetail />} />
                <Route path="*" element={<Navigate to="/panel" replace />} />
            </Routes>
        </section>
    )
}