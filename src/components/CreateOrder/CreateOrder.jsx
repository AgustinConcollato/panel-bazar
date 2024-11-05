import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { Loading } from '../Loading/Loading'
import './CreateOrder.css'
import Select from 'react-select'
import { generateId } from '../../utils/generateId'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: 'white',
        borderColor: state.isFocused ? '#3d6caa' : '#ced4da',
        borderRadius: '10px',
        boxShadow: null,
        '&:hover': {
            borderColor: '',
        },
        padding: '3px 5px'
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#3d6caa' : state.isFocused ? '#3d6caa40' : 'white',
        color: state.isSelected ? 'white' : 'black',
        padding: '10px', // Espacio interno de cada opción
    }),
}

export function CreateOrder() {

    const { Firebase, Order } = api

    const [error, setError] = useState(null)
    const [users, setUsers] = useState(null)
    const [clients, setClients] = useState(null)
    const [name, setName] = useState(null)

    async function getUsers() {
        const firebase = new Firebase()

        setUsers(await firebase.users())
    }

    async function createOrder(e) {
        e.preventDefault()
        setError(null)

        const order = new Order()

        const formData = new FormData(e.target)
        formData.append('status', 'pending')
        formData.append('date', new Date().getTime())
        formData.append('comment', '')
        formData.append('total_amount', 0)
        formData.append('id', generateId())
        formData.append('client_name', name)

        try {
            const response = await toast.promise(order.create({ data: formData }), {
                pending: 'Creando...',
                success: 'Creado correctamente',
                error: 'Error, no se puedo crear'
            })

            if (response) {
                console.log('navegar al pedido ')
            }

        } catch (error) {
            const errorData = JSON.parse(error.message)
            console.log(errorData)
            if (errorData.errors?.client) {
                setError('Selecciona un cliente')
            } else if (errorData.error?.message) {
                setError(errorData.error.message)
            }
        }
    }

    function changeSelect({ label }) {
        setName(label)
        setError(null)
    }

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <>
            <form onSubmit={createOrder} className="form-new-order">
                <h3>Crear un nuevo pedido</h3>
                <div>
                    <div>
                        {(users) ?
                            <>
                                {/* <Select
                                styles={customStyles}
                                options={clients.map(e => ({ value: e.id, label: e.name }))}
                                placeholder="Clientes"
                                isSearchable
                                name='clients'
                            /> */}
                                <Select
                                    styles={customStyles}
                                    options={users.map(e => ({ value: e.uid, label: e.displayName }))}
                                    placeholder="Usuarios de la web"
                                    isSearchable
                                    onChange={changeSelect}
                                    name='client'
                                />
                            </> :
                            <Loading />
                        }
                    </div>
                </div>
                <button className="btn btn-solid">Crear</button>
                {error && <p className='error'>{error}</p>}
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
        </>
    )
}