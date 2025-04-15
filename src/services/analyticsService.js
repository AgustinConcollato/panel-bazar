import { urlAnalytics as url } from './api'

export class Analytics {
    constructor() {
        this.token = localStorage.getItem('authToken')
        this.url = new URL(url)
    }

    async netProfit({ year, month }) {
        let urlRequest = `${url}/net-profit`;

        const params = new URLSearchParams();
        params.append("year", year);

        if (month !== undefined && month !== "all") {
            params.append("month", month);
        }

        // Concatenamos los parámetros solo si existen
        const fullUrl = `${urlRequest}?${params.toString()}`;
        const response = await fetch(fullUrl, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });

        return await response.json();
    }

    async grossProfit() {

    }

}