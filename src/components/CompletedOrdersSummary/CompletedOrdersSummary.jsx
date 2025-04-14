import { Link } from 'react-router-dom';
import { useCompletedOrders } from '../../hooks/useCompletedOrders';
import { Loading } from '../Loading/Loading';
import './CompletedOrdersSummary.css';
import { useEffect, useState } from 'react';

export function CompletedOrdersSummary() {


    const [date, setDate] = useState(new Date());

    const { orders, difference } = useCompletedOrders(date);

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    useEffect(() => {
        setDate(new Date());
    }, []);

    return (
        <div className='completed-orders-summary'>
            {orders ?
                <div>
                    <h3 className="title">Pedidos terminados en {months[date.getMonth()]}</h3>
                    <p>Cantidad de pedidos <span>{orders.currentOrders.length}</span></p>
                    <div>
                        <h2>${parseInt(orders.currentOrders.reduce((a, order) => a + parseFloat(order.total_amount), 0)).toLocaleString()}</h2>
                        <p className={difference < 0 ? 'inactive' : difference > 0 ? 'active' : 'diference'}>
                            {difference > 0 ? '+' : ''}
                            {difference.toFixed(2)}%
                            <span>En relación al mes pasado</span>
                        </p>
                    </div>
                </div> :
                <Loading />
            }
            <Link to={'/resumen-mensual'} className="btn">Ver detalle del mes</Link>
        </div>
    )
}