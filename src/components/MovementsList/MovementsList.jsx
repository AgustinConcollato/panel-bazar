import { useState } from "react"
import { Link } from "react-router-dom"
import { MoneyReceiveIcon, MoneySendIcon } from "../../icons/icons"
import { Modal } from "../Modal/Modal"
import './MovementsList.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"

export function MovementsList({ movements }) {

    const [details, setDetails] = useState(null)

    function groupMovementsByDate(movements) {
        return movements.reduce((groups, movement) => {
            const date = new Date(movement.created_at).toLocaleDateString()
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
                                <li key={index} className={`movement ${e.type}`} onClick={() => setDetails(e)}>
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
                                                    {new Date(e.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })} hs
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
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            {details &&
                <Modal onClose={() => setDetails(null)}>
                    <div className="movement-details-info">
                        <h2>
                            {details.type === "in" ?
                                <MoneyReceiveIcon color={'#000'} height={'30px'} width={'30px'} /> :
                                <MoneySendIcon color={'#000'} height={'30px'} width={'30px'} />
                            }
                            {details.type == "in" ? 'Ingreso de dinero' : 'Egreso de dinero'}
                        </h2>
                        {(details.payment || details.description) &&
                            < div >
                                <p>{details.description}</p>
                                {details.payment &&
                                    <Link to={`/pedido/${details.payment.order_id}/completed`}>
                                        Ver detalle del pedido
                                    </Link>
                                }
                            </div>
                        }
                        <ul>
                            <li>
                                <span>Fecha y Hora</span>
                                <b>
                                    {new Date(details.created_at).toLocaleTimeString('es-AR', { day: 'numeric', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}
                                </b>
                            </li>
                            <li><span>Ingreso total</span> <b> ${parseFloat(details.total_amount).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</b></li>
                            <li><span>Ingreso saldo</span> <b> ${parseFloat(details.amount).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</b></li>
                            <li>
                                <span>Método</span>
                                <b>
                                    {details.method === 'transfer' && ' Transferencia'}
                                    {details.method === 'cash' && ' Efectivo'}
                                    {details.method === 'check' && ' Cheque'}
                                </b>
                            </li>
                        </ul>
                        <div className="movement-details-info-money">
                            <p>Saldo</p>
                            <div>
                                <div>
                                    <span>Antes</span>
                                    <h3>${details.previous_balance}</h3>
                                </div>
                                <FontAwesomeIcon icon={faArrowRight} />
                                <div>
                                    <span>Después</span>
                                    <h3>${details.current_balance}</h3>
                                </div>
                            </div>
                        </div>
                        <button className="btn" onClick={() => setDetails(null)}>Cerrar</button>
                    </div>
                </Modal >
            }
        </>
    )
} 