import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { CashRegisterSummary } from "../CashRegisterSummary/CashRegisterSummary"
import { Loading } from "../Loading/Loading"
import { MovementsList } from "../MovementsList/MovementsList"

export function CashRegisterDetail({ cashRegistersList }) {

    const { cashRegisterId } = useParams()

    const [movements, setMovements] = useState(null)

    return (
        <>
            <CashRegisterSummary
                setMovements={setMovements}
                cashRegisterId={cashRegisterId}
                cashRegistersList={cashRegistersList}
            />
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
        </>
    )
}