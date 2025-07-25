import { faAngleDown, faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import { CashRegisterDetail } from "../../components/CashRegisterDetail/CashRegisterDetail"
import { Loading } from "../../components/Loading/Loading"
import { Modal } from "../../components/Modal/Modal"
import { CashRegister } from "../../services/CashRegister"
import './CashRegisterPage.css'

export function CashRegisterPage() {

    const cashRegister = new CashRegister()

    const navigate = useNavigate()
    const location = useLocation()

    const [cashRegistersList, setCashRegistersList] = useState(null)
    const [newCashRegister, setNewCashRegister] = useState(false)
    const [loading, setLoading] = useState(false)

    const [maxVisible, setMaxVisible] = useState(4);
    const [showDropdown, setShowDropdown] = useState(false);

    async function createCashRegister(e) {
        e.preventDefault()

        const formData = new FormData(e.target)
        setLoading(true)
        try {
            const response = await toast.promise(cashRegister.create(formData), {
                pending: 'Creando nueva caja...',
                success: 'Caja creada correctamente',
            })

            setNewCashRegister(false)
            setCashRegistersList(current => [...current, response])
            navigate(`/caja/${response.id}`)
        } catch (error) {
            if (error.errors.name) toast.error(error.errors.name[0])
        } finally {
            setLoading(false)
        }
    }

    async function getCashRegistersList() {
        try {
            const response = await cashRegister.get()
            setCashRegistersList(response.sort((a, b) => b.primary - a.primary))

            if (location.pathname === "/caja") {
                const mainRegister = response.find(e => e.primary)
                if (mainRegister) {
                    navigate(`/caja/${mainRegister.id}`, { replace: true })
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const updateMaxVisible = () => {
            const width = window.innerWidth;
            if (width <= 450) {
                setMaxVisible(1);
            } else {
                setMaxVisible(4);
            }
        };

        updateMaxVisible();
        window.addEventListener("resize", updateMaxVisible);
        return () => window.removeEventListener("resize", updateMaxVisible);
    }, []);

    useEffect(() => {
        document.title = 'Caja'
        getCashRegistersList()
    }, [])

    const visibleItems = cashRegistersList?.slice(0, maxVisible);
    const hiddenItems = cashRegistersList?.slice(maxVisible);

    return (
        <section>
            <div className="cash-register">
                {cashRegistersList ?
                    <ul className="cash-register-list">
                        {visibleItems.map((e) => (
                            <li key={e.id} className="cash-register-list-item">
                                <NavLink to={`/caja/${e.id}`}>{e.name}</NavLink>
                            </li>
                        ))}

                        {hiddenItems.length > 0 && (
                            <li className="cash-register-dropdown">
                                <button onClick={() => setShowDropdown(!showDropdown)}>
                                    Más <FontAwesomeIcon icon={faAngleDown} />
                                </button>
                                {showDropdown && (
                                    <div className="dropdown-menu">
                                        {hiddenItems.map((e) => (
                                            <NavLink
                                                key={e.id}
                                                to={`/caja/${e.id}`}
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                {e.name}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </li>
                        )}

                        <li>
                            <button onClick={() => setNewCashRegister(true)}>+</button>
                        </li>
                    </ul> :
                    <Loading />
                }
                <Routes>
                    <Route path=":cashRegisterId" element={<CashRegisterDetail cashRegistersList={cashRegistersList} />} />
                </Routes>
            </div>
            {newCashRegister &&
                <Modal onClose={() => setNewCashRegister(false)}>
                    <div className="section-form">
                        <form onSubmit={createCashRegister}>
                            <div className="header-form">
                                <h2>Crear nueva caja</h2>
                            </div>
                            <div>
                                <div>
                                    <p>Nombre</p>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Nombre"
                                        name="name"
                                    />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p>Descripción</p>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Descripción (máximo 50 caracteres)"
                                        maxLength={50}
                                        name="description"
                                    />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p>Saldo</p>
                                    <input
                                        type="number"
                                        defaultValue={0}
                                        className="input"
                                        placeholder="Saldo"
                                        name="balance"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-solid" disabled={loading}>{loading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Crear caja'}</button>
                            <button type="button" className="btn" onClick={() => setNewCashRegister(false)}> Cancelar</button>
                        </form>
                    </div>
                </Modal>
            }
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
                stacked />
        </section>
    )
}