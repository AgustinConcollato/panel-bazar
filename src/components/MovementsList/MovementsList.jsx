import { Link } from "react-router-dom"
import { MoneyReceiveIcon, MoneySendIcon } from "../../icons/icons"
import './MovementsList.css'

export function MovementsList({ movements }) {
    function groupMovementsByDate(movements) {
        return movements.reduce((groups, movement) => {
            const date = new Date(movement.updated_at).toLocaleDateString()
            if (!groups[date]) {
                groups[date] = []
            }
            groups[date].push(movement)
            return groups
        }, {})
    }

    return (
        <>
            <h3>Últimos movimientos</h3>
            <div className="movements-container">
                {Object.entries(groupMovementsByDate(movements)).map(([date, dateMovements]) => (
                    <div key={date} className="movement-group">
                        <h4 className="movement-date-header">{date}</h4>
                        <ul className="movements-list">
                            {dateMovements.map((e, index) => (
                                <li key={index} className={`movement ${e.type}`}>
                                    <Link to={e.payment ? `/pedido/${e.payment.order_id}/completed` : ''}>
                                        <div className="movement-info">
                                            <div className="movement-info-icon">
                                                {e.type === "in" ?
                                                    <MoneyReceiveIcon color={'#000'} height={'30px'} width={'30px'} /> :
                                                    <MoneySendIcon color={'#000'} height={'30px'} width={'30px'} />
                                                }
                                            </div>
                                            <div>
                                                <span className="movement-type">
                                                    {e.type === "in" ? "Ingreso " : "Egreso "}
                                                    <span className="movement-time">
                                                        {new Date(e.updated_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })} hs
                                                    </span>
                                                </span>
                                                <span className="movement-description">{e.description}</span>
                                            </div>
                                        </div>
                                        <div className="movement-details">
                                            <span className="movement-amount movement-type">
                                                {e.type === "in" ? '+' : '-'} ${parseFloat(e.total_amount).toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                                            </span>
                                            <span className="movement-time">
                                                {e.type === "in" ? '+' : '-'} ${parseFloat(e.amount).toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    )
} 