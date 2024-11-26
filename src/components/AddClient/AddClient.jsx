import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { generateId } from '../../utils/generateId'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './AddClient.css'
import { api } from 'api-services'


export function AddClient() {

    const { Clients } = api

    async function addClient(e) {
        e.preventDefault()

        const clients = new Clients()

        const formData = new FormData(e.target)

        formData.append('id', generateId())

        try {
            const response = await toast.promise(clients.add(formData), {
                pending: 'Agregando cliente...',
                success: 'Se agregó correctamente',
                error: 'Error, no se puedo agregar'
            })

            if (response.status == 'success') {
                e.target.reset()
            }

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <>
            <section className='section-add-client'>
                <div>
                    <Link to={'/pedidos'} className="btn" ><FontAwesomeIcon icon={faArrowLeft} size="xs" /></Link>
                    <h1>Nuevo cliente</h1>
                </div>
                <div>
                    <form onSubmit={addClient}>
                        <input
                            type="text"
                            name="name"
                            className="input"
                            placeholder='Nombre del cliente'
                            required
                        />
                        <button type="submit" className='btn btn-solid'>Agregar</button>
                        <button type="reset" className='btn btn-thins'>Descartar</button>
                    </form>
                </div>
            </section>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition:Bounce
                stacked />
        </>
    )
}