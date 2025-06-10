import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Order } from '../../services/ordersService';
import { Modal } from '../Modal/Modal';
import { NewAddress } from '../NewAddress/NewAddress';
import './ClientList.css';
import { Clients } from '../../services/clientsService';

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
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [client, setClient] = useState(e);

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

    async function updateClient(e) {   
        e.preventDefault();
        
        const clients = new Clients();

        const formData = new FormData(e.target);

        const data = {};
        formData.forEach((value, key) => {
            if (value !== '') {
                data[key] = value;
            }
        });

        // Chequear si hay cambios respecto al cliente actual
        let hasChanges = false;
        for (const key of Object.keys(data)) {
            if (data[key] !== String(client[key] ?? '')) {
                hasChanges = true;
                break;
            }
        }
        if (!hasChanges) {
            toast.info('No hay cambios para actualizar');
            return;
        }

        setLoading(true);
        try {
            const response = await toast.promise(clients.update({id: client.id, data}), {
                pending: 'Actualizando cliente...',
                success: 'Cliente actualizado correctamente'
            });

            setClient(response);
            setEdit(false);

        } catch (error) {

            if (error.error) {
                toast.error(error?.error);
                return
            }

            if (error?.errors) {
                const errors = Object.values(error.errors).map(err => err[0]);
                toast.error(errors.join(', '));
            }

        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {   
        setClient(e)
    }, [e]);

    return (
        <>
        <li key={client.id}>
            <div>
                {client.name}
                {client.payments.length != 0 &&
                    <span className='payment-pending'>
                        {client.payments.length} pagos pendientes 
                        <FontAwesomeIcon icon={faCircleExclamation} color="#ff8800" />
                    </span>
                } 
                <ul>
                    <li>Correo: {client.email}</li>
                    <li>Celular: {client.phone_number}</li>
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
                <button className="btn btn-regular" onClick={()=> setNewOrder({name: client.name, id: client.id})}> Crear pedido </button>
                <button className="btn btn-regular" onClick={()=> setChangeAddress(e)}> Agregar dirección </button>
                <button className="btn" onClick={()=> setEdit(true)}> Editar </button>
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
                <div className="container-children">
                <NewAddress
                    setAddresses={setAddresses}
                    onClose={setChangeAddress}
                    total={addresses.length == 0 ? 0 : addresses.length}
                    client={changeAddress}
                />
                </div>
                <div className="background-modal" onClick={()=> setChangeAddress(false)}></div>
            </Modal>
        }
        {edit &&
            <Modal>
                <div className='container-children section-form'>
                    <h2>Editar cliente</h2>
                    <form onSubmit={updateClient}>
                        <div>
                            <div>
                                <p>Nombre</p>
                                <input
                                    type="text"
                                    name="name"
                                    className='input'
                                    defaultValue={client.name}
                                />
                            </div>
                        </div>
                        <div>
                            <div>
                                <p>Correo</p>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder='Correo electrónico'
                                    className='input'
                                    defaultValue={client.email}
                                />
                            </div>
                        </div>
                        <div>
                            <div>
                                <p>Celular</p>
                                <input
                                    type="text"
                                    name="phone_number"
                                    placeholder='Ej: 1234567890'
                                    className='input'
                                    defaultValue={client.phone_number}
                                />
                            </div>
                        </div>
                        <div className="container-btn">
                            <button type='submit' className='btn btn-solid'>Actualizar</button>
                            <button className='btn' onClick={() => setEdit(false)}>Cancelar</button>
                        </div>
                    </form>
                </div>
                <div className="background-modal" onClick={()=> setEdit(false)}></div>
            </Modal>
        }
        </>
    )
}