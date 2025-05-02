import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { api } from '../../services/api'
import { Loading } from '../Loading/Loading'
import './CreateOrder.css'

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: 'white',
        borderColor: state.isFocused ? '#3d6caa' : '#ddd',
        borderRadius: '5px',
        boxShadow: null,
        width: '100%',
        '&:hover': {
            borderColor: '',
        },
        padding: '5px 10px'
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#3d6caa' : state.isFocused ? '#3d6caa40' : 'white',
        color: state.isSelected ? 'white' : 'black',
        padding: '10px', // Espacio interno de cada opción
    }),
}

export function CreateOrder() {

    const { Order, Clients } = api

    const [clients, setClients] = useState(null)
    const [name, setName] = useState(null)

    const navigate = useNavigate()

    async function getClients() {
        const clients = new Clients()

        setClients(await clients.get())
    }

    async function createOrder(e) {
        e.preventDefault()

        const order = new Order()

        const formData = new FormData(e.target)
        formData.append('status', 'accepted')
        formData.append('total_amount', 0)
        formData.append('client_name', name)

        try {
            const response = await toast.promise(order.create({ data: formData }), {
                pending: 'Creando...',
                success: 'Creado correctamente',
                error: 'Error, no se puedo crear'
            })

            if (response) {
                navigate(`/pedido/${response.id}/${response.status}`)
            }

        } catch (error) {
            console.log(error)
        }
    }

    function changeSelect({ label }) {
        setName(label)
    }

    useEffect(() => {
        getClients()
    }, [])

    return (
        <div>
            <form onSubmit={createOrder} className="form-new-order">
                <div>
                    <h3 className='title'>Crear un nuevo pedido</h3>
                    {clients ?
                        < Select
                            styles={customStyles}
                            options={clients.filter(e => e.source == 'dashboard').map(e => ({ value: e.id, label: e.name }))}
                            placeholder="Clientes"
                            onChange={changeSelect}
                            isSearchable
                            name='client_id'
                        /> :
                        <Loading />}
                </div>
                <button type="submit" className="btn btn-solid">Crear</button>
            </form >
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
        </div>
    )
}