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

    async compareWithPreviousMonth({ year, month }) {

        const params = new URLSearchParams();   

        params.append("year", year);
        params.append("month", month);

        const fullUrl = `${url}/compare-with-previous-month?${params.toString()}`;

        try {
            const response = await fetch(fullUrl, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            })

            if (!response.ok) {
                const error = await response.json()
                throw error
            }

            return await response.json()
        } catch (error) {
            throw error
        }
    }

    async resume({ year, month }) {
        let urlRequest = `${url}/resume`;

        const params = new URLSearchParams();
        params.append("year", year);

        if (month !== undefined && month !== "all") {
            params.append("month", month);
        }

        const fullUrl = `${urlRequest}?${params.toString()}`;

        try {
            const response = await fetch(fullUrl, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            })

            if (!response.ok) {
                const error = await response.json()
                throw error
            }

            return await response.json()
        } catch (error) {
            throw error
        }
    }
}
