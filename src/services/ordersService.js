import { urlOrder as url } from "./api";

export class Order {
    constructor() {
        this.token = localStorage.getItem('authToken')
    }

    async create({ data }) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`
            },
            body: data
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }

        return await response.json()
    }

    async pending(id = null) {

        if (id) {
            const response = await fetch(`${url}/pending/${id}`)

            return await response.json()
        }

        const response = await fetch(`${url}/pending`)
        return await response.json()
    }

    async completed({ clientId, year, month }) {
        let urlRequest = `${url}/completed`;

        if (clientId) {
            urlRequest += `/${clientId}`;
        }

        // Construimos los parámetros de la URL
        const params = new URLSearchParams();
        params.append("year", year);

        if (month !== undefined && month !== "all") {
            params.append("month", month);
        }

        // Concatenamos los parámetros solo si existen
        const fullUrl = `${urlRequest}?${params.toString()}`;
        const response = await fetch(fullUrl);

        return await response.json();
    }

    async getAll(userId) {
        try {
            const response = await fetch(`${url}/user/${userId}`)
            const orders = await response.json()
            return orders
        } catch (error) {
            console.log('error al obtener todos los pedidos', error)
        }
    }

    async get(id) {
        try {
            const response = await fetch(`${url}/${id}`)

            if (!response.ok) {
                const error = await response.json()
                throw error
            }

            return await response.json()
        } catch (error) {
            throw error
        }
    }

    async add(data) {
        try {
            const response = await fetch(`${url}/product/add`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                body: data
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

    async remove(data) {
        try {
            const response = await fetch(`${url}/product/remove`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(data)
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

    async delete(id) {
        try {
            const response = await fetch(`${url}/cancel/${id}`, {
                method: 'DELETE',
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

    async complete(id) {
        try {
            const response = await fetch(`${url}/complete/${id}`, {
                method: 'PUT',
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

    async update(data) {
        try {
            const response = await fetch(`${url}/product`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
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

    async remit(orderData) {
        let date

        if (orderData.status == 'pending') {
            date = new Date().getTime()
        } else {
            date = orderData.date
        }

        try {
            const response = await fetch(`${url}/pdf/${orderData.id}?date=${date}`)
            const data = await response.blob()
            const pdfUrl = URL.createObjectURL(data);
            return pdfUrl
        } catch (error) {
            throw new Error(error)
        }
    }
}