import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import { AddClient } from './components/AddClient/AddClient'
import { AddProduct } from './components/AddProduct/AddProduct'
import { NavBar } from './components/NavBar/NavBar'
import { Order } from './components/OrderComponents/Order/Order'
import { ProductDetail } from './components/ProductDetail/ProductDetail'
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute'
import { Shortcuts } from './components/Shortcuts/Shortcuts'
import { ClientsPage } from './pages/ClientsPage'
import { OrderPage } from './pages/OrderPage/OrderPage'
import { ProductsPage } from './pages/ProductsPage/ProductsPage'
import { ProviderPage } from './pages/ProviderPage'
import { Search } from './components/Search/Search'
import { AddProvider } from './components/AddProvider/AddProvider'
import { SearchResultsPage } from './pages/SearchResultsPage'


function ProtectedLayout({ isAuthenticated }) {
  return (
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <Outlet />
    </ProtectedRoute>
  );
}

function App() {
  const isAuthenticated = !!localStorage.getItem('authToken')
  return (
    <>
      <NavBar />
      <header>
        <Search />
      </header>
      <main>
        <Routes>
          <Route element={<ProtectedLayout isAuthenticated={isAuthenticated} />}>
            <Route path='/panel' element={<Shortcuts />} />
            <Route path='/productos' element={<ProductsPage />} />
            <Route path='/producto/:id' element={<ProductDetail />} />
            <Route path='/agregar-producto' element={<AddProduct />} />
            <Route path='/agregar-cliente' element={<AddClient />} />
            <Route path='/pedidos' element={<OrderPage />} />
            <Route path='/pedidos/:id' element={<Order />} />
            <Route path='/clientes' element={<ClientsPage />} />
            <Route path='/proveedores' element={<ProviderPage />} />
            <Route path='/agregar-proveedor' element={<AddProvider />} />
            <Route path='/buscador/:productName' element={<SearchResultsPage />} />
            <Route path="*" element={<Navigate to="/panel" replace />} />
          </Route>
        </Routes>
      </main>
    </>
  )
}

export default App
