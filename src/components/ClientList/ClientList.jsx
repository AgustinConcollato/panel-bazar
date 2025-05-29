import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Order } from '../../services/ordersService';
import './ClientList.css';

export function ClientList({clients}) {
    const [openDetail, setOpenDetail] = useState(null);

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
        <ul className='client-list'>
            {clients.map((e, idx) =>
                <li key={e.id}>
                    <div>
                        {e.name}
                        <ul>
                            <li>Correo: {e.email}</li>
                            <li>Celular: {e.phone_number}</li>
                            <li>Pagos pendientes: 
                                {e.payments.length === 0 ?
                                    ' No hay' : 
                                    <>
                                        {e.payments.length} <FontAwesomeIcon icon={faCircleExclamation} color="#ff8800" />
                                        <button className="btn btn-small" style={{marginLeft: 8}} onClick={() => setOpenDetail(openDetail === idx ? null : idx)}>
                                            Ver detalle
                                        </button>
                                        {openDetail === idx && (
                                            <ul className="pending-payments-detail">
                                                {e.payments.map((p, i) => (
                                                    <li key={p.id || i}>
                                                        <span>{p.method === 'cash' ? 'Efectivo' : p.method === 'transfer' ? 'Transferencia' : 'Cheque'}:</span> 
                                                        <span>
                                                            ${parseFloat(p.expected_amount - (p.paid_amount || 0)).toLocaleString('es-AR', { maximumFractionDigits: 2 })} / ${parseFloat(p.expected_amount).toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                                                        </span>
                                                        <a href={`/pedido/${p.order_id}/completed`} className='btn'>Ver pedido</a>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                } 
                            </li>
                            <li>Dirección:
                            {e.address.length > 0 ? (
                                <ul>
                                    {e.address.filter((addr, idx) =>{
                                        if (addr.status == 'selected') return (
                                        <li key={addr.id || idx}>
                                            {addr.city ? `${addr.city}, ` : ''}
                                            {addr.province ? `${addr.province}, ` : ''}
                                            {addr.address ? `${addr.address}, ` : ''}
                                            {addr.address_number ? `${addr.address_number}, ` : ''}
                                            {addr.code_zip ? `${addr.code_zip}` : ''}
                                        </li>
                                    )})}
                                </ul>
                            ) : (
                                <span> Sin direcciones</span>
                            )}
                        </li>
                        </ul>
                    </div>
                    <div className="container-btn">
                        <Link to={'/cliente/' + e.id} className="btn btn-regular"> Ver detalle </Link>
                        <button className="btn btn-regular" onClick={()=> crateOrder({name: e.name, id: e.id})}> Crear pedido </button>
                        <button className="btn"> Editar </button>
                    </div>
                </li>
            )}
            <ToastContainer />
        </ul>
    )
}

// client_id: ea5fcaa0-85f5-42c1-b0cb-bbaa843684e4
// status: accepted
// total_amount:0
// client_name: cliente nuevo 2