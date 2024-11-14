import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { NavBar } from './components/NavBar/NavBar'
import { ProductsPage } from './pages/ProductsPage'
import { ProductDetail } from './components/ProductDetail/ProductDetail'
import { AddProduct } from './components/AddProduct/AddProduct'
import { Search } from './components/Search/Search'
import { Menu } from './components/Menu/Menu'
import { OrderPage } from './pages/OrdersPage'
import './App.css'
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute'
import { Order } from './components/Order/Order'
import { AddClient } from './components/AddClient/AddClient'
import { ClientsPage } from './pages/ClientsPage'


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
      <header>
        <Search />
        <Menu />
      </header>
      <NavBar />
      <main>
        <Routes>
          <Route element={<ProtectedLayout isAuthenticated={isAuthenticated} />}>
            <Route path='/panel' element={'hola'} />
            <Route path='/productos/*' element={<ProductsPage />} />
            <Route path='/producto/:id' element={<ProductDetail />} />
            <Route path='/agregar-producto' element={<AddProduct />} />
            <Route path='/agregar-cliente' element={<AddClient />} />
            <Route path='/pedidos' element={<OrderPage />} />
            <Route path='/pedido/:id' element={<Order />} />
            <Route path='/clientes' element={<ClientsPage />} />
            <Route path="*" element={<Navigate to="/panel" replace />} />
          </Route>
        </Routes>
      </main>
    </>
  )
}

export default App
