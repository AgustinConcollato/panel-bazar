import { Link } from 'react-router-dom';
import './CompletedOrdersSummary.css'
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Loading } from '../Loading/Loading';

export function CompletedOrdersSummary() {

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const date = new Date()
    const { Order } = api

    const [orders, setOrders] = useState(null);
    const [difference, setDifference] = useState(null);

    async function getOrders() {
        const order = new Order();

        const currentMonth = date.getMonth() + 1;
        const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;

        const currentYear = date.getFullYear();
        const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;

        try {
            const currentOrders = await order.completed({ month: currentMonth, year: currentYear });

            const lastOrders = await order.completed({ month: lastMonth, year: lastYear });

            setOrders({ currentOrders, lastOrders });

            const currentTotal = currentOrders.reduce((sum, order) => sum + order.total_amount, 0) || 0;
            const lastTotal = lastOrders.reduce((sum, order) => sum + order.total_amount, 0) || 0;

            const difference = lastTotal > 0 ? ((currentTotal - lastTotal) / lastTotal) * 100 : 0;

            setDifference(difference)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getOrders()
    }, [])

    return (
        <div className='completed-orders-summary'>
            {orders ?
                <div>
                    <h3 className="title">Pedidos terminados en {months[date.getMonth()]}</h3>
                    <p>Cantidad de pedidos <span>{orders.currentOrders.length}</span></p>
                    <div>
                        {console.log(orders.lastOrders)}
                        <h2>${parseInt(orders.currentOrders.reduce((a, order) => a + parseFloat(order.total_amount), 0)).toLocaleString()}</h2>
                        <p className={difference < 0 ? 'inactive' : difference > 0 ? 'active' : 'diference'}>
                            {difference < 0 ? '-' : difference > 0 ? '+' : ''}
                            {difference}%
                            <span>En relación al mes pasado</span>
                        </p>
                    </div>
                </div> :
                <Loading />
            }
            <Link to={'/'} className="btn">Ver detalle del mes</Link>
        </div>
    )
}