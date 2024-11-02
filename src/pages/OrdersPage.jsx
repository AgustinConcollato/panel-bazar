import { useEffect } from "react"

export function OrderPage() {
    return (
        <>
            <section>
                <form>

                    <input type="text" placeholder="cliente" />
                    <select name="client">
                        <option value="">Mateo</option>
                        <option value="">Guido</option>
                        <option value="">Facundo</option>
                    </select>
                </form>
                <div>
                    mostrar los pedidso pendientes
                </div>
            </section>
            <section>
                lista de los pedidos terminados del mes
            </section>
        </>
    )
}