import { useEffect, useState } from "react"
import { api } from '../../services/api'
import { Modal } from '../../components/Modal/Modal'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import './CashRegisterSummary.css'

export function CashRegisterSummary({ setMovements = () => { } }) {

    const [totalIn, setTotalIn] = useState()
    const [totalOut, setTotalOut] = useState()
    const [available, setAvailable] = useState()
    const [monthlyIn, setMonthlyIn] = useState()
    const [monthlyOut, setMonthlyOut] = useState()
    const [showDepositModal, setShowDepositModal] = useState(false)
    const [showWithdrawModal, setShowWithdrawModal] = useState(false)
    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('')
    const [method, setMethod] = useState('cash')
    const [loading, setLoading] = useState(false)
    const [totals, setTotals] = useState(false)

    const { CashRegister } = api

    function getCurrentDate() {
        const now = new Date()
        // Ajustar a la zona horaria de Argentina (UTC-3)
        const argentinaTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
        return argentinaTime.toISOString()
    }

    async function handleDeposit(e) {
        e.preventDefault()
        const cashRegister = new CashRegister()

        try {
            setLoading(true)
            await cashRegister.deposit({
                amount: parseFloat(amount),
                total_amount: parseFloat(amount),
                description,
                method,
                date: getCurrentDate()
            })

            setShowDepositModal(false)
            setAmount('')
            setDescription('')
            setMethod('cash')
            getCashRegister()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    async function handleWithdraw(e) {
        e.preventDefault()
        const cashRegister = new CashRegister()

        try {
            setLoading(true)

            await cashRegister.withdraw({
                amount: parseFloat(amount),
                total_amount: parseFloat(amount),
                description,
                method,
                date: getCurrentDate()
            })

            setShowWithdrawModal(false)
            setAmount('')
            setDescription('')
            setMethod('cash')
            getCashRegister()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    async function getCashRegister() {
        const cashRegister = new CashRegister()

        try {
            const response = await cashRegister.get()

            const { balance, monthly, movements } = response
            const { total_in, total_out, available } = balance
            const { total_in: monthly_in, total_out: monthly_out } = monthly

            setAvailable(available.toLocaleString('es-AR', { maximumFractionDigits: 2 }))
            setTotalIn(parseFloat(total_in).toLocaleString('es-AR', { maximumFractionDigits: 2 }))
            setTotalOut(parseFloat(total_out).toLocaleString('es-AR', { maximumFractionDigits: 2 }))
            setMonthlyIn(parseFloat(monthly_in).toLocaleString('es-AR', { maximumFractionDigits: 2 }))
            setMonthlyOut(parseFloat(monthly_out).toLocaleString('es-AR', { maximumFractionDigits: 2 }))
            setMovements(movements)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCashRegister()
    }, [])

    return (
        <>
            <div className="cash-register-header">
                <h2><span>Saldo actual</span> ${available}</h2>
                <div className="cash-register-actions">
                    <button className="btn btn-success-solid" onClick={() => setShowDepositModal(true)}>Depositar</button>
                    <button className="btn btn-error-solid" onClick={() => setShowWithdrawModal(true)}>Retirar</button>
                </div>
            </div>
            <div className="cash-register-summary-container">
                {totals ?
                    <div className="cash-register-summary-section">
                        <h3>Totales Generales</h3>
                        <div className="cash-register-summary">
                            <div>
                                <span>Total ingresos</span>
                                <h3>${totalIn}</h3>
                            </div>
                            <div>
                                <span>Total egresos</span>
                                <h3>${totalOut}</h3>
                            </div>
                        </div>
                    </div> :
                    <div className="cash-register-summary-section">
                        <h3>Totales del Mes</h3>
                        <div className="cash-register-summary">
                            <div>
                                <span>Ingresos del mes</span>
                                <h3>${monthlyIn}</h3>
                            </div>
                            <div>
                                <span>Egresos del mes</span>
                                <h3>${monthlyOut}</h3>
                            </div>
                        </div>
                    </div>
                }
                <div className="change-cash-register-summary-section" onClick={() => setTotals(!totals)}>
                    <p>{totals ? 'Ver totales del mes' : 'Ver totales generales'}</p>
                </div>
            </div>
            {showDepositModal && (
                <Modal>
                    <div className="container-children section-form">
                        <h2>Realizar depósito</h2>
                        <form onSubmit={handleDeposit}>
                            <div>
                                <div>
                                    <p>Monto</p>
                                    <input
                                        className="input"
                                        placeholder="Monto"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p>Descripción</p>
                                    <input
                                        className="input"
                                        placeholder="Descripción"
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p>Método</p>
                                    <select value={method} className="input" onChange={(e) => setMethod(e.target.value)}>
                                        <option value="cash">Efectivo</option>
                                        <option value="transfer">Transferencia</option>
                                        <option value="check">Cheque</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <button className="btn btn-solid" type="submit" disabled={loading}>{loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Confirmar'}</button>
                                <button className="btn" type="button" onClick={() => setShowDepositModal(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                    <div className="background-modal" onClick={() => setShowDepositModal(false)}></div>
                </Modal>
            )}

            {showWithdrawModal && (
                <Modal>
                    <div className="container-children section-form">
                        <h2>Realizar retiro</h2>
                        <form onSubmit={handleWithdraw}>
                            <div>
                                <div>
                                    <p>Monto</p>
                                    <input
                                        className="input"
                                        placeholder="Monto"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p>Descripción</p>
                                    <input
                                        className="input"
                                        placeholder="Descripción"
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p>Método</p>
                                    <select value={method} className="input" onChange={(e) => setMethod(e.target.value)}>
                                        <option value="cash">Efectivo</option>
                                        <option value="transfer">Transferencia</option>
                                        <option value="check">Cheque</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <button className="btn btn-solid" type="submit" disabled={loading}>{loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Confirmar'}</button>
                                <button className="btn" type="button" onClick={() => setShowWithdrawModal(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                    <div className="background-modal" onClick={() => setShowWithdrawModal(false)}></div>
                </Modal>
            )}
        </>
    )
}