import { useEffect, useState } from "react"
import { api } from "../../services/api"
import { Link } from "react-router-dom"
import { formatDate } from "../../utils/formatDate"
import { Loading } from "../Loading/Loading"
import './CompletedOrders.css'

export function CompletedOrders() {

    const { Order } = api

    // 🔹 Iniciamos con la fecha actual
    const currentDate = new Date();
    const [date, setDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
    const [orders, setOrders] = useState(null);
    const [monthFilter, setMonthFilter] = useState(date.getMonth() + 1); // Estado para el mes seleccionado

    const currentYear = currentDate.getFullYear();
    const startYear = 2025;
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);

    const months = [
        'Todos los meses', // Opción adicional para buscar el año completo
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // 🔹 Obtener pedidos completados
    async function getCompletedOrders() {
        try {
            const order = new Order();

            const options = {
                year: date.getFullYear(),
            };

            // Solo enviamos el mes si no está deshabilitado
            if (monthFilter !== "all") {
                options.month = monthFilter;
            }

            const response = await order.completed(options);
            setOrders(response);
        } catch (error) {
            console.error("Error fetching completed orders:", error);
        }
    }


    function handleMonthChange(e) {
        const selectedValue = e.target.value;

        if (selectedValue === "all") {
            setMonthFilter("all"); // Deshabilita el filtro por mes
        } else {
            const month = parseInt(selectedValue, 10);
            setMonthFilter(month);
            setDate(new Date(date.getFullYear(), month - 1, 1));
        }
    }


    function handleYearChange(e) {
        const year = parseInt(e.target.value, 10);
        setDate(new Date(year, date.getMonth(), 1));
    }


    useEffect(() => {
        setOrders(null)
        getCompletedOrders();
    }, [date, monthFilter]);


    return (
        <div className="completed-orders">
            <div className="completed-orders-header">
                <h3>Pedidos terminados</h3>
                <div>
                    <div className="filter">
                        <span>Mes</span>
                        <select className="input" onChange={handleMonthChange} value={monthFilter}>
                            {months.map((mes, i) => (
                                <option key={i} value={i === 0 ? "all" : i}>
                                    {mes}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter">
                        <span>Año</span>
                        <select className="input" onChange={handleYearChange} value={date.getFullYear()}>
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="container-completed-orders">
                {orders ? (
                    orders.length !== 0 ? (
                        orders.map((e) => (
                            <Link key={e.id} to={`/pedidos/${e.id}`}>
                                <div>
                                    <h4>{e.client_name}</h4>
                                    <span>{formatDate(e.updated_at)}</span>
                                </div>
                                <div>
                                    {e.discount ? (
                                        <>
                                            <p>
                                                <span>-{e.discount}%</span>
                                                <span>${e.total_amount}</span>
                                            </p>
                                            <p>
                                                ${e.total_amount - (e.total_amount * e.discount) / 100}
                                            </p>
                                        </>
                                    ) : (
                                        <span>${e.total_amount}</span>
                                    )}
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p>No hay pedidos terminados</p>
                    )
                ) : (
                    <Loading />
                )}
            </div>
        </div>
    )
}
