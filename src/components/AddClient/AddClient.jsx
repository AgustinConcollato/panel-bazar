import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { api } from '../../services/api'
import './AddClient.css'

export function AddClient() {

    const { Clients } = api

    async function addClient(e) {
        e.preventDefault()

        const clients = new Clients()

        const formData = new FormData(e.target)

        try {
            const response = await toast.promise(clients.add(formData), {
                pending: 'Agregando cliente...',
                success: 'Se agregó correctamente',
                error: 'Error, no se puedo agregar'
            })

            if (response) {
                e.target.reset()
            }

        } catch (error) {
            console.log(error)
        }

    }

    return (
        <>
            <section className='section-add-client'>
                <div className='section-form'>
                    <form onSubmit={addClient}>
                        <div className='header-form'>
                            <h1>Nuevo cliente</h1>
                        </div>
                        <div>
                            <div>
                                <p>Nombre</p>
                                <input
                                    type="text"
                                    name="name"
                                    className="input"
                                    placeholder='Nombre'
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <div>
                                <p>Número de teléfono</p>
                                <input
                                    type="text"
                                    className='input'
                                    name='phone_number'
                                    placeholder='Número de teléfono'
                                />
                            </div>
                        </div>
                        <input type="text" hidden name='email' value={''} />
                        <input type="text" hidden name='source' value={'dashboard'} />
                        <input type="text" hidden name='password' value={'Dashboard123$'} />
                        <input type="text" hidden name='password_confirmation' value={'Dashboard123$'} />
                        <div>
                            <button type="submit" className='btn btn-solid'>Agregar</button>
                            <button type="reset" className='btn'>Descartar</button>
                        </div>
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