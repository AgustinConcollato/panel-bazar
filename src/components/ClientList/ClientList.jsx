import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Clients } from '../../services/clientsService';
import { Order } from '../../services/ordersService';
import { Modal } from '../Modal/Modal';
import { NewAddress } from '../NewAddress/NewAddress';
import './ClientList.css';

export function ClientList({ clients }) {
    return (
        <ul className='client-list'>
            {clients.map(e =>
                <Client e={e} key={e.id} />
            )}
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
        </ul>
    )
}

function Client({ e }) {
    const [newOrder, setNewOrder] = useState(false);
    const [changeAddress, setChangeAddress] = useState(false);
    const [addresses, setAddresses] = useState(e.address || []);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [client, setClient] = useState(e);
    const [isSelected, setIsSelected] = useState(false);

    const navigate = useNavigate();

    async function crateOrder({ name, id }) {
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
            if (key === 'phone_number' || key === 'email') {
                data[key] = value.trim();
            } else if (value !== '') {
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
            const response = await toast.promise(clients.update({ id: client.id, data }), {
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
                Object.values(error.errors).map(err =>
                    toast.error(err[0])
                );
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
            <li
                key={client.id}
                className={`client-item ${isSelected ? 'selected' : ''}`}
                onClick={() => setIsSelected(!isSelected)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsSelected(!isSelected);
                    }
                }}
                role="button"
                tabIndex={0}
            >
                <h3>
                    {client.name}
                    {client.payments.length != 0 ?
                        <span className='payment-pending'>
                            <FontAwesomeIcon icon={faCircleExclamation} color="#ff8800" />
                            {client.payments.length} pagos pendientes
                        </span> :
                        <span className='not-payment-pending'>Sin pagos pendientes</span>
                    }
                </h3>
                <p>Correo: {client.email ?? 'Sin correo'}</p>
                <p>Celular: {client.phone_number ?? 'Sin Celular'}</p>
                <div>
                    Dirección:
                    {addresses.length > 0 ? (
                        <span>
                            {addresses.map((addr, idx) => {
                                if (addr.status == 'selected') return (
                                    <>
                                        {addr.address ? ` ${addr.address}` : ''}
                                        {addr.address_number ? ` ${addr.address_number},` : ''}
                                        {addr.city ? ` ${addr.city}, ` : ''}
                                        {addr.province ? ` ${addr.province} ` : ''}
                                    </>
                                )
                            })}
                        </span>
                    ) : (
                        <span> Sin direcciones</span>
                    )}
                </div>
                <div className="container-btn">
                    <Link to={'/cliente/' + e.id} className="btn btn-regular"> Ver detalle </Link>
                    <button className="btn" onClick={() => setEdit(true)}> Editar </button>
                    <button className="btn btn-regular" onClick={() => setNewOrder({ name: client.name, id: client.id })}> Crear pedido </button>
                    <button className="btn btn-regular" onClick={() => setChangeAddress(e)}> Agregar dirección </button>
                </div>
            </li>
            {newOrder &&
                <Modal onClose={() => setNewOrder(false)}>
                    <div className='new-order-modal'>
                        <h2>Crear nuevo pedido para {newOrder.name}</h2>
                        <button className='btn btn-solid' onClick={() => crateOrder(newOrder)}>Crear pedido</button>
                        <button className='btn' onClick={() => setNewOrder(false)}>Cancelar</button>
                    </div>
                </Modal>
            }
            {changeAddress &&
                <Modal onClose={() => setChangeAddress(false)}>
                    <div>
                        <NewAddress
                            setAddresses={setAddresses}
                            onClose={setChangeAddress}
                            total={addresses.length == 0 ? 0 : addresses.length}
                            client={changeAddress}
                        />
                    </div>
                </Modal>
            }
            {edit &&
                <Modal onClose={() => setEdit(false)}>
                    <div className='section-form'>
                        <form onSubmit={updateClient}>
                            <div className="header-form">
                                <h2>Editar cliente</h2>
                            </div>
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
                </Modal>
            }
        </>
    )
}