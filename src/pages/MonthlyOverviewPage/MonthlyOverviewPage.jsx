import { useEffect, useState } from "react";
import { CompletedOrderFilter } from "../../components/CompletedOrderFilter/CompletedOrderFilter";
import { CompletedOrders } from "../../components/CompletedOrders/CompletedOrders";
import { Loading } from "../../components/Loading/Loading";
import { useCompareWithPreviousMonth } from "../../hooks/useCompareWithPreviousMonth";
import './MonthlyOverviewPage.css';
import { Pagination } from "../../components/Pagination/Pagination";
import { Analytics } from "../../services/analyticsService";
import { OrderList } from "../../components/OrderList/OrderList";

export function MonthlyOverviewPage() {

    const currentDate = new Date();
    const analytics = new Analytics();
    const [date, setDate] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
    const [monthFilter, setMonthFilter] = useState(date.getMonth() + 1); // Estado para el mes seleccionado

    const currentYear = currentDate.getFullYear();
    const startYear = 2025;
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);

    const { orders, comparison } = useCompareWithPreviousMonth(date);

    const [page, setPage] = useState(1);
    const [resume, setResume] = useState(null);

    const months = [
        'Todos los meses',
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    async function getResume() {
        const response = await analytics.resume({ year: date.getFullYear(), month: date.getMonth() + 1 });
        setResume(response.resume);
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
        getResume();
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
                {resume && comparison ?
                    <>
                        <h1>Detalle de {months[date.getMonth() + 1]}
                            <p className={comparison.gross_profit_change < 0 ? 'inactive' : comparison.gross_profit_change > 0 ? 'active' : 'diference'}>
                                {comparison.gross_profit_change > 0 ? '+' : ''}
                                {comparison.gross_profit_change.toFixed(2)}%
                                <span>En relación al mes pasado</span>
                            </p>
                        </h1>
                        <div>
                            <p>Cantidad de pedidos <span>{orders.quantity}</span></p>
                            <div className="profit">
                                <h2>
                                    <span>Granancia bruta</span>
                                    ${resume.gross_profit.toFixed(2)}
                                </h2>
                                <h2>
                                    <span>Granancia neta</span>
                                    ${resume.net_profit.toFixed(2)}
                                </h2>
                                <h2>
                                    <span>Porcentaje de ganancia</span>
                                    {resume.profit_percentage.toFixed(2)}%
                                </h2>
                                <h2>
                                    <span>Costos</span>
                                    ${resume.cost.toFixed(2)}
                                </h2>
                            </div>
                        </div>
                        <OrderList status="completed" year={date.getFullYear()} month={date.getMonth() + 1} />
                    </> :
                    <Loading />
                }
            </div>
        </div>
    )
} 