import { useContext, useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AddClient } from './components/AddClient/AddClient'
import { AddProduct } from './components/AddProduct/AddProduct'
import { AddProvider } from './components/AddProvider/AddProvider'
import { Loading } from './components/Loading/Loading'
import { NavBar } from './components/NavBar/NavBar'
import { Order } from './components/OrderComponents/Order/Order'
import { ProductDetail } from './components/Product/ProductDetail/ProductDetail'
import { Search } from './components/Search/Search'
import { Shortcuts } from './components/Shortcuts/Shortcuts'
import { AuthContext } from './context/AuthContext'
import { CampaignPage } from './pages/CampaignPage/CampaignPage'
import { ClientsPage } from './pages/ClientsPage/ClientsPage'
import { MonthlyOverviewPage } from './pages/MonthlyOverviewPage/MonthlyOverviewPage'
import { OrderPage } from './pages/OrderPage/OrderPage'
import { ProductsPage } from './pages/ProductsPage/ProductsPage'
import { ProviderPage } from './pages/ProviderPage/ProviderPage'
import { SearchResultsPage } from './pages/SearchResultsPage'
import { AddCampaign } from './components/AddCampaign/AddCampaign'

function App() {
  const { user } = useContext(AuthContext)

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsAuthenticated(user)
  }, [user])

  return (
    <>
      {isAuthenticated ?
        isAuthenticated.user ?
          <>
            <NavBar />
            <header>
              <Search />
            </header>
            <main>
              <Routes>
                <Route path='/panel' element={<Shortcuts />} />
                <Route path='/productos' element={<ProductsPage />} />
                <Route path='/producto/:id' element={<ProductDetail />} />
                <Route path='/agregar-producto' element={<AddProduct />} />
                <Route path='/agregar-cliente' element={<AddClient />} />
                <Route path='/pedidos/*' element={<OrderPage />} />
                <Route path='/pedido/:id/*' element={<Order />} />
                <Route path='/clientes' element={<ClientsPage />} />
                <Route path='/proveedores/*' element={<ProviderPage />} />
                <Route path='/agregar-proveedor' element={<AddProvider />} />
                <Route path='/resumen-mensual' element={<MonthlyOverviewPage />} />
                <Route path='/buscador/:productName' element={<SearchResultsPage />} />
                <Route path='/eventos/*' element={<CampaignPage />} />
                <Route path='/agregar-evento' element={<AddCampaign />} />
                <Route path="*" element={<Navigate to="/panel" replace />} />
              </Routes>
            </main>
          </> :
          <Routes>
            <Route path="*" element={<Navigate to="/ingresar" replace />} />
          </Routes> :
        <div>
          <Loading />
        </div>
      }
    </>
  )
}

export default App
