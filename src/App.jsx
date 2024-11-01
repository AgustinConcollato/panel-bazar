import { Route, Routes } from 'react-router-dom'
import { NavBar } from './components/NavBar/NavBar'
import { ProductsPage } from './pages/ProductsPage'
import { ProductDetail } from './components/ProductDetail/ProductDetail'
import { AddProduct } from './components/AddProduct/AddProduct'
import { Search } from './components/Search/Search'
import { Menu } from './components/Menu/Menu'
import { OrderPage } from './pages/OrdersPage'
import './App.css'

function App() {
  return (
    <>
      <header>
        <Search />
        <Menu />
      </header>
      <NavBar />
      <main>
        <Routes>
          <Route path='/' element={'hola'} />
          <Route path='/productos/*' element={<ProductsPage />} />
          <Route path='/producto/:id' element={<ProductDetail />} />
          <Route path='/agregar-producto' element={<AddProduct />} />
          <Route path='/pedidos' element={<OrderPage />} />
          <Route path='/clientes' element={'clientes'} />
        </Routes>
      </main>
    </>
  )
}

export default App
