import { useEffect, useState } from 'react'
import { api, url } from '../../services/api'
import './login.css'
import { Navigate } from 'react-router-dom'

export function Login() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'))

    const { Auth } = api

    async function submitLogin(e) {
        e.preventDefault()
        const auth = new Auth()

        try {
            const response = await auth.login(password)

            if (response.token) {
                localStorage.setItem('authToken', response.token)
                setIsAuthenticated(true)
            } else {
                console.error('Error de login:', response);
            }

        } catch (error) {
            setError('Contraseña incorrecta')
        }
    }

    // function register() {
    //     fetch('https://www.bazarrshop.com/api/register', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ name: 'admin', password: '1872fa43', email: 'panelbazar@gmail.com' })
    //     })
    //         .then(e => e.json())
    //         .then(e => console.log(e))
    // }

    // useEffect(() => {
    //     register()
    // }, [])

    return isAuthenticated ?
        <Navigate to="/" replace /> :
        <section className='login'>
            <form onSubmit={submitLogin}>
                <h2>Iniciar sesión</h2>
                <input
                    className='input'
                    type="text"
                    placeholder='Contraseña'
                    onChange={({ target }) => setPassword(target.value)}
                    required
                />
                <button className='btn btn-solid' type="submit">Ingresar</button>
            </form>
            {error && <p className='error'>{error}</p>}
        </section>
}