import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCompareWithPreviousMonth } from '../../hooks/useCompareWithPreviousMonth';
import { Loading } from '../Loading/Loading';
import './CompletedOrdersSummary.css';

export function CompletedOrdersSummary() {

    const [date, setDate] = useState(new Date());

    const { orders, comparison } = useCompareWithPreviousMonth(date);

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    return (
        <div className='completed-orders-summary'>
            {orders && comparison ?
                <div>
                    <h3 className="title">Pedidos terminados en {months[date.getMonth()]}</h3>
                    <p>Cantidad de pedidos <span>{orders.quantity}</span></p>
                    <div>
                        <h2>${orders.total_amount}</h2>
                        <p className={comparison.gross_profit_change < 0 ? 'inactive' : comparison.gross_profit_change > 0 ? 'active' : 'diference'}>
                            {comparison.gross_profit_change > 0 ? '+' : ''}
                            {comparison.gross_profit_change.toFixed(2)}%
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