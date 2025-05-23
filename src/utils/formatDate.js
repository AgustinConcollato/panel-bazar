export const formatDate = (date) => {
    if (!date) return '--'

    // Si la fecha ya viene en formato YYYY-MM-DD, la parseamos directamente
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [year, month, day] = date.split('-');
        return new Date(year, month - 1, day).toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    // Si no, usamos el método anterior
    return new Date(date).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}