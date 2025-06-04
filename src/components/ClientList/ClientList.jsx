import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Order } from '../../services/ordersService';
import { Modal } from '../Modal/Modal';
import { NewAddress } from '../NewAddress/NewAddress';
import './ClientList.css';

export function ClientList({clients}) {
    return (
        <>
            <ul className='client-list'>
                {clients.map(e =>
                    <Client e={e}/>
                )}
            </ul>
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
                stacked 
            />
        </>
    )
}

function Client({e}) {
    const [newOrder, setNewOrder] = useState(false);
    const [changeAddress, setChangeAddress] = useState(false);
    const [addresses, setAddresses] = useState(e.address || []);

    const navigate = useNavigate();

    async function crateOrder({name, id}){
        const order = new Order()

        const formData = new FormData()
        formData.append('status', 'accepted')
        formData.append('total_amount', 0)
        formData.append('client_name', name)
        formData.append('client_id', id)

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

    return (
        <>
        <li key={e.id}>
            <div>
                {e.name}
                {e.payments.length != 0 &&
                    <span className='payment-pending'>
                        {e.payments.length} pagos pendientes 
                        <FontAwesomeIcon icon={faCircleExclamation} color="#ff8800" />
                    </span>
                } 
                <ul>
                    <li>Correo: {e.email}</li>
                    <li>Celular: {e.phone_number}</li>
                    <li>Dirección:
                    {addresses.length > 0 ? (
                        <span>
                            {addresses.map((addr, idx) =>{
                                if (addr.status == 'selected') return (
                                <>
                                    {addr.address ? ` ${addr.address}` : ''}
                                    {addr.address_number ? ` ${addr.address_number},` : ''}
                                    {addr.city ? ` ${addr.city}, ` : ''}
                                    {addr.province ? ` ${addr.province} ` : ''}
                                </>
                            )})}
                        </span>
                    ) : (
                        <span> Sin direcciones</span>
                    )}
                    </li>
                </ul>
            </div>
            <div className="container-btn">
                <Link to={'/cliente/' + e.id} className="btn btn-regular"> Ver detalle </Link>
                <button className="btn btn-regular" onClick={()=> setNewOrder({name: e.name, id: e.id})}> Crear pedido </button>
                <button className="btn btn-regular" onClick={()=> setChangeAddress(e)}> Agregar dirección </button>
                <button className="btn"> Editar </button>
            </div>
        </li>
        {newOrder &&
            <Modal>
                <div className='container-children'>
                    <h2>Nuevo pedido</h2>
                    <p>Crear nuevo pedido para {newOrder.name}</p>
                    <div className="container-btn">
                    <button className='btn' onClick={() => setNewOrder(false)}>Cancelar</button>
                        <button className='btn btn-solid' onClick={() => crateOrder(newOrder)}>Crear pedido</button>
                    </div>
                </div>
                <div className="background-modal" onClick={()=> setNewOrder(false)}></div>
            </Modal>
        }
        {changeAddress &&
            <Modal>
            {console.log(addresses.length)}
                <div className="container-children">
                <NewAddress
                    setAddresses={setAddresses}
                    onClose={setChangeAddress}
                    total={addresses.length == 0 ? 0 : addresses.length}
                    client={changeAddress}
                />
                </div>
                <div className="background-modal" onClick={()=> setNewOrder(false)}></div>
            </Modal>
        }
        </>
    )
}