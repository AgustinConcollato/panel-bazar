import { useEffect, useState } from "react"
import { CashRegisterSummary } from "../../components/CashRegisterSummary/CashRegisterSummary"
import { Loading } from "../../components/Loading/Loading"
import { MovementsList } from "../../components/MovementsList/MovementsList"
import './CashRegisterPage.css'

export function CashRegisterPage() {

    const [movements, setMovements] = useState(null)

    useEffect(() => {
        document.title = 'Caja'
    }, [])

    return (
        <section>
            <div className="cash-register">
                <CashRegisterSummary setMovements={setMovements} />
                {movements ?
                    movements.length > 0 ?
                        <MovementsList movements={movements} /> :
                        <>
                            <h3>Últimos movimientos</h3>
                            <p>Todavían no hay movimientos</p>
                        </>
                    :
                    <Loading />
                }
            </div>
        </section>
    )
}