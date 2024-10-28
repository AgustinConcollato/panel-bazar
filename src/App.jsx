import { Route, Routes } from 'react-router-dom'
import { NavBar } from './components/NavBar/NavBar'
import { ProductsPage } from './pages/ProductsPage'
import { ProductDetail } from './components/ProductDetail/ProductDetail'
import { AddProduct } from './components/AddProduct/AddProduct'
import './App.css'
import { Search } from './components/Search/Search'

function App() {
  return (
    <>
      <header>
        <Search />
      </header>
      <NavBar />
      <main>
        <Routes>
          <Route path='/' element={'hola'} />
          <Route path='/productos/*' element={<ProductsPage />} />
          <Route path='/producto/:id' element={<ProductDetail />} />
          <Route path='/agregar-producto' element={<AddProduct />} />
          <Route path='/pedidos' element={'pedido'} />
          <Route path='/facturar' element={'factura'} />
        </Routes>
      </main>
    </>
  )
}

export default App
