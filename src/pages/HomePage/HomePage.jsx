import { CashRegisterSummary } from "../../components/CashRegisterSummary/CashRegisterSummary";
import { Shortcuts } from "../../components/Shortcuts/Shortcuts";
import './HomePage.css'

export function HomePage() {
    return (
        <section className="home-page">
            <CashRegisterSummary />
            <Shortcuts />
        </section>
    )
}