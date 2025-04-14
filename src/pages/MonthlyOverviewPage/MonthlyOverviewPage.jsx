import { useEffect, useState } from "react";
import { CompletedOrderFilter } from "../../components/CompletedOrderFilter/CompletedOrderFilter";
import { CompletedOrders } from "../../components/CompletedOrders/CompletedOrders";
import { Loading } from "../../components/Loading/Loading";
import { useCompletedOrders } from "../../hooks/useCompletedOrders";
import './MonthlyOverviewPage.css';

export function MonthlyOverviewPage() {

    const currentDate = new Date();
    const [date, setDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
    const [monthFilter, setMonthFilter] = useState(date.getMonth() + 1); // Estado para el mes seleccionado

    const { orders, difference } = useCompletedOrders(date);
    const currentYear = currentDate.getFullYear();
    const startYear = 2025;
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);

    const months = [
        'Todos los meses',
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

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
        document.title = 'Resumen de ' + months[date.getMonth() + 1];
    }, [date]);

    return (
        <div className="monthly-overview">
            <div className="header-monthly-overview">
                <CompletedOrderFilter
                    date={date}
                    months={months}
                    years={years}
                    monthFilter={monthFilter}
                    handleMonthChange={handleMonthChange}
                    handleYearChange={handleYearChange}
                />
                <h1>Detalle de {months[date.getMonth() + 1]}</h1>
                {orders ?
                    <div>
                        <p>Cantidad de pedidos <span>{orders.currentOrders.length}</span></p>
                        <div className="total-amount">
                            <h2>${parseInt(orders.currentOrders.reduce((a, order) => a + parseFloat(order.total_amount), 0)).toLocaleString()}</h2>
                            <p className={difference < 0 ? 'inactive' : difference > 0 ? 'active' : 'diference'}>
                                {difference > 0 ? '+' : ''}
                                {difference.toFixed(2)}%
                                <span>En relación al mes pasado</span>
                            </p>
                        </div>
                    </div> :
                    <Loading />
                }
            </div>
            <CompletedOrders orders={orders} />
        </div>
    )
} 