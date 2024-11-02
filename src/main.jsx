import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/ingresar' element={'hola'} />
      <Route path='/*' element={<App />} />
    </Routes>
  </BrowserRouter>
)
