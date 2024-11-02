import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import { Login } from './components/Login/Login.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/ingresar' element={<Login />} />
      <Route path='/*' element={<App />} />
    </Routes>
  </BrowserRouter>
)
