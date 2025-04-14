import './CompletedOrderFilter.css';

export function CompletedOrderFilter({ monthFilter, date, months, years, handleMonthChange, handleYearChange }) {
    const currentDate = new Date();
    const selectedYear = date.getFullYear();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    return (
        <div className='date-filter'>
            <div className="filter">
                <span>Mes</span>
                <select className="input" onChange={handleMonthChange} value={monthFilter}>
                    {months.map((mes, i) => {
                        if (selectedYear < currentYear || i <= currentMonth + 1) {
                            return (
                                <option key={i} value={i}>
                                    {mes}
                                </option>
                            );
                        }
                        return null;
                    })}
                </select>
            </div>

            <div className="filter">
                <span>Año</span>
                <select className="input" onChange={handleYearChange} value={selectedYear}>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
