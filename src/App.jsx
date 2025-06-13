import { useContext, useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AddCampaign } from './components/AddCampaign/AddCampaign'
import { AddClient } from './components/AddClient/AddClient'
import { AddProduct } from './components/AddProduct/AddProduct'
import { AddProvider } from './components/AddProvider/AddProvider'
import { Loading } from './components/Loading/Loading'
import { NavBar } from './components/NavBar/NavBar'
import { Order } from './components/OrderComponents/Order/Order'
import { ClientDetail } from './components/ClientDetail/ClientDetail'
import { ProductDetail } from './components/Product/ProductDetail/ProductDetail'
import { Search } from './components/Search/Search'
import { AuthContext } from './context/AuthContext'
import { CampaignPage } from './pages/CampaignPage/CampaignPage'
import { CashRegisterPage } from './pages/CashRegisterPage/CashRegisterPage'
import { ClientsPage } from './pages/ClientsPage/ClientsPage'
import { HomePage } from './pages/HomePage/HomePage'
import { MonthlyOverviewPage } from './pages/MonthlyOverviewPage/MonthlyOverviewPage'
import { OrderPage } from './pages/OrderPage/OrderPage'
import { ProductsPage } from './pages/ProductsPage/ProductsPage'
import { ProviderPage } from './pages/ProviderPage/ProviderPage'
import { SearchResultsPage } from './pages/SearchResultsPage'
import { BarcodeScanner } from './components/BarcodeScanner/BarcodeScanner'
import { ShoppingPage } from './pages/ShoppingPage/ShoppingPage'

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
                <Route path='/panel' element={<HomePage />} />
                <Route path='/productos' element={<ProductsPage />} />
                <Route path='/producto/:id' element={<ProductDetail />} />
                <Route path='/agregar-producto' element={<AddProduct />} />
                <Route path='/agregar-cliente' element={<AddClient />} />
                <Route path='/pedidos/*' element={<OrderPage />} />
                <Route path='/pedido/:id/*' element={<Order />} />
                <Route path='/clientes' element={<ClientsPage />} />
                <Route path='/cliente/:id' element={<ClientDetail />} />
                <Route path='/proveedores/*' element={<ProviderPage />} />
                <Route path='/agregar-proveedor' element={<AddProvider />} />
                <Route path='/resumen-mensual' element={<MonthlyOverviewPage />} />
                <Route path='/buscador/:productName' element={<SearchResultsPage />} />
                <Route path='/eventos/*' element={<CampaignPage />} />
                <Route path='/agregar-evento' element={<AddCampaign />} />
                <Route path='/caja' element={<CashRegisterPage />} />
                <Route path='/compras' element={<ShoppingPage />} />
                <Route path='/codigo' element={<BarcodeScanner/>} />
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
