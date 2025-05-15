import { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import './login.css'
import { Loading } from '../Loading/Loading'

export function Login() {

    const { user, login } = useContext(AuthContext)

    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [userStatus, setUserStatus] = useState(null)

    async function submitLogin(e) {
        e.preventDefault()

        try {
            const user = await login(password)

            if (user) {
                window.location.href = '/panel'
            }
        } catch (error) {
            setError('Contraseña incorrecta')
        }
    }

    // function register() {
    //     fetch('http://localhost:8000/api/register', {
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

    useEffect(() => {
        setUserStatus(user)
    }, [user])

    return !userStatus ?
        <Loading /> :
        userStatus.user ?
            <Navigate to="/panel" replace /> :
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