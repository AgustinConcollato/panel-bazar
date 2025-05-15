import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import { Login } from './components/Login/Login.jsx'
import { AppDataProvider } from './context/AppDataContext.jsx'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path='/ingresar' element={<Login />} />
        <Route path='/*' element={
          <AppDataProvider>
            <App />
          </AppDataProvider>
        } />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
)
