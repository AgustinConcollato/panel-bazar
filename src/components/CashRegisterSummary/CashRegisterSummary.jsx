import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Modal } from '../../components/Modal/Modal'
import { api } from '../../services/api'
import './CashRegisterSummary.css'

export function CashRegisterSummary({ setMovements = () => { }, cashRegisterId, cashRegistersList }) {

    const [totalIn, setTotalIn] = useState()
    const [totalOut, setTotalOut] = useState()
    const [available, setAvailable] = useState('0')
    const [amountIn, setAmountIn] = useState()
    const [amountOut, setAmountOut] = useState()
    const [showDepositModal, setShowDepositModal] = useState(false)
    const [showWithdrawModal, setShowWithdrawModal] = useState(false)
    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('')
    const [method, setMethod] = useState('cash')
    const [destination, setDestination] = useState('save')
    const [loading, setLoading] = useState(false)
    const [showTransferMoneyModal, setShowTransferMoneyModal] = useState(false)
    const [cashRegisterSelected, setCashRegisterSelected] = useState()
    const [transfer, setTranfer] = useState({})


    const { CashRegister } = api
    const cashRegister = new CashRegister()

    function getCurrentDate() {
        const now = new Date()
        // Ajustar a la zona horaria de Argentina (UTC-3)
        const argentinaTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
        return argentinaTime.toISOString()
    }

    async function handleTransferMoney(e) {
        e.preventDefault()

        if (transfer.from === transfer.to) {
            return toast.info('Selecciona alguna caja')
        }

        setLoading(true)
        try {
            await cashRegister.transferMoney({
                amount: parseFloat(amount),
                total_amount: parseFloat(amount),
                description,
                method,
                destination,
                date: getCurrentDate(),
                from: transfer.from,
                to: transfer.to

            })

            setShowTransferMoneyModal(false)
            setAmount('')
            setDescription('')
            setMethod('cash')
            setTranfer({})
            getCashRegister()
        } catch (error) {
            if (error.error) {
                toast.error(error.error)
                return
            }
            if (error.errors) {
                toast.error(error.errors.to && 'Selecciona una caja de donde retirar')
                toast.error(error.errors.from && 'Selecciona una caja donde ingresar')
                return
            }
        } finally {
            setLoading(false)
        }
    }

    async function handleDeposit(e) {
        e.preventDefault()

        try {
            setLoading(true)
            await cashRegister.deposit({
                amount: parseFloat(amount),
                total_amount: parseFloat(amount),
                description,
                method,
                destination,
                cash_register_id: cashRegisterSelected,
                date: getCurrentDate()
            })

            setShowDepositModal(false)
            setAmount('')
            setDescription('')
            getCashRegister()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    async function handleWithdraw(e) {
        e.preventDefault()

        try {
            setLoading(true)

            await cashRegister.withdraw({
                amount: parseFloat(amount),
                total_amount: parseFloat(amount),
                description,
                method,
                destination,
                cash_register_id: cashRegisterSelected,
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

    async function getCashRegister(id) {
        const cashRegister = new CashRegister()

        setLoading(true)
        setMovements(null)
        try {
            const response = await cashRegister.get(cashRegisterId)

            const { balance, monthly, movements } = response
            const { total_in, total_out, amount_in, amount_out } = monthly

            setAvailable(parseFloat(balance).toLocaleString('es-AR', { maximumFractionDigits: 2 }))
            setTotalIn(parseFloat(total_in).toLocaleString('es-AR', { maximumFractionDigits: 2 }))
            setTotalOut(parseFloat(total_out).toLocaleString('es-AR', { maximumFractionDigits: 2 }))
            setAmountIn(parseFloat(amount_in).toLocaleString('es-AR', { maximumFractionDigits: 2 }))
            setAmountOut(parseFloat(amount_out).toLocaleString('es-AR', { maximumFractionDigits: 2 }))
            setMovements(movements.data)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCashRegister()
        setCashRegisterSelected(cashRegisterId)
    }, [cashRegisterId])

    return (
        <>
            {!loading &&
                <>
                    <div className="cash-register-header">
                        <h2>
                            ${available.split(',')[0]}
                            <span>{available.split(',')[1] ? ',' + available.split(',')[1] : ''}</span>
                            <p>Saldo actual en {cashRegistersList?.filter(c => c.id === cashRegisterId)[0].name}</p>
                        </h2>
                        <div className="cash-register-actions">
                            <button className="btn btn-error-regular" onClick={() => { setShowWithdrawModal(true); setDestination('spend') }}>Retirar</button>
                            <button className="btn btn-regular" onClick={() => { setShowTransferMoneyModal(true); setDestination('save') }}>Mover</button>
                            <button className="btn btn-success-regular" onClick={() => { setShowDepositModal(true); setDestination('spend') }}>Depositar</button>
                        </div >
                    </div >
                    <div className="cash-register-summary-container">
                        <p>{cashRegistersList?.filter(c => c.id === cashRegisterId)[0].description}</p>
                        <div className="cash-register-summary-section">
                            <h3>Totales del Mes</h3>
                            <div className="cash-register-summary">
                                <div>
                                    <span>Ingresos del mes</span>
                                    <h3><span>Total:</span> ${totalIn}</h3>
                                    <h3><span>Saldo:</span> ${amountIn}</h3>
                                </div>
                                <div>
                                    <span>Egresos del mes</span>
                                    <h3>${amountOut}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
            {
                showDepositModal && (
                    <Modal onClose={() => { setShowDepositModal(false) }}>
                        <div className="section-form">
                            <form onSubmit={handleDeposit}>
                                <h2>Realizar depósito</h2>
                                <div>
                                    <div>
                                        <p>Caja a depositar</p>
                                        <select className="input" defaultValue={cashRegisterSelected} onChange={(e) => setCashRegisterSelected(e.target.value)}>
                                            {cashRegistersList.map(e =>
                                                <option value={e.id}>{e.name}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
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
                                    <button className="btn" type="button" onClick={() => { setShowDepositModal(false) }}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                )
            }

            {
                showWithdrawModal && (
                    <Modal onClose={() => setShowWithdrawModal(false)}>
                        <div className="section-form">
                            <form onSubmit={handleWithdraw}>
                                <h2>Realizar retiro</h2>
                                <div>
                                    <div>
                                        <p>Caja a retirar</p>
                                        <select className="input" defaultValue={cashRegisterSelected} onChange={(e) => setCashRegisterSelected(e.target.value)}>
                                            {cashRegistersList.map(e =>
                                                <option value={e.id}>{e.name}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
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
                    </Modal>
                )
            }

            {
                showTransferMoneyModal && (
                    <Modal onClose={() => { setShowTransferMoneyModal(false); setTranfer({}) }}>
                        <div className="section-form">
                            <form onSubmit={handleTransferMoney}>
                                <h2>Mover dinero</h2>
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
                                <div style={{ flexDirection: 'row' }}>
                                    <div style={{ width: '100%' }}>
                                        <p>Retirar en</p>
                                        <select className="input" onChange={(e) => setTranfer(current => ({ from: e.target.value, to: current.to }))}>
                                            <option value="">Seleccionar caja</option>
                                            {cashRegistersList
                                                .filter(c => c.id !== transfer.to) // filtra la caja destino
                                                .map(c =>
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                )}
                                        </select>
                                    </div>
                                    <div style={{ width: '100%' }}>
                                        <p>Ingresar en</p>
                                        <select className="input" onChange={(e) => setTranfer(current => ({ from: current.from, to: e.target.value }))}>
                                            <option value="">Seleccionar caja</option>
                                            {cashRegistersList
                                                .filter(c => c.id !== transfer.from) // filtra la caja origen
                                                .map(c =>
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                )}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <button className="btn btn-solid" type="submit" disabled={loading}>{loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Confirmar'}</button>
                                    <button className="btn" type="button" onClick={() => { setShowTransferMoneyModal(false); setTranfer({}) }}>Cancelar</button>
                                </div>
                            </form>
                        </div >
                    </Modal >
                )
            }
        </>
    )
}