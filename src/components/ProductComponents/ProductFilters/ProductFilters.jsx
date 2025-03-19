import { useContext, useEffect } from "react";
import { AppDataContext } from "../../../context/AppDataContext";
import { Loading } from "../../Loading/Loading";
import { useSearchParams } from "react-router-dom";
import "./ProductFilters.css";

export function ProductFilters() {
    const { categories } = useContext(AppDataContext);
    const [searchParams, setSearchParams] = useSearchParams();

    const handleFilterChange = (filter, value, isSorting = false) => {
        const newParams = new URLSearchParams(searchParams); // Copia de los parámetros

        if (!isSorting) {
            newParams.delete('page')
        }

        if (value) {
            newParams.set(filter, value);
        } else {
            newParams.delete(filter);
        }

        setSearchParams(newParams); // Actualiza la URL con los nuevos filtros
    };

    return (
        <div className="container-filters">
            <div className="filter">
                <span>Categoría</span>
                {categories ? (
                    <select
                        className="input"
                        onChange={(e) => handleFilterChange("category", e.target.value)}
                        value={searchParams.get("category") || ""}
                    >
                        <option value="">Todas</option>
                        {categories.map((e) => (
                            <option key={e.code} value={e.code}>
                                {e.name}
                            </option>
                        ))}
                    </select>
                ) : (
                    <Loading />
                )}
            </div>

            <div className="filter">
                <span>Precio</span>
                <select
                    className="input"
                    onChange={(e) => { handleFilterChange('price', e.target.value, true) }}
                >
                    <option value="">Seleccionar filtro</option>
                    <option value="min">Menor precio</option>
                    <option value="max">Mayor precio</option>
                </select>
            </div>

            <div className="filter">
                <span>Estado</span>
                <select
                    className="input"
                    onChange={(e) => { handleFilterChange('status', e.target.value) }}
                >
                    <option value="">Ambos</option>
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
                </select>
            </div>
        </div>
    );
}
