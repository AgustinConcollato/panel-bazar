import { urlOrder as url } from "./api";

export class Order {
    constructor() {
        this.token = localStorage.getItem('authToken')
    }

    async create({ data }) {
        const response = await fetch(url, {
            method: 'POST',
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

    async completed(id = null) {

        const time = new Date()

        const currentMonthStart = new Date(time.getFullYear(), time.getMonth(), 1).getTime()
        const currentMonthEnd = new Date(time.getFullYear(), time.getMonth() + 1, 0).getTime()

        if (id) {
            const response = await fetch(`${url}/completed/${id}?currentMonthStart=${currentMonthStart}&currentMonthEnd=${currentMonthEnd}`)

            return await response.json()
        }

        const response = await fetch(`${url}/completed?currentMonthStart=${currentMonthStart}&currentMonthEnd=${currentMonthEnd}`)
        return await response.json()
    }

    async get(id) {
        try {
            const response = await fetch(`${url}/${id}`)

            if (!response.ok) {
                const { status, message } = await response.json()
                throw new Error(`${message}`)
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
                body: data
            })

            if (!response.ok) {
                const { message } = await response.json()
                throw new Error(message)
            }

            return await response.json()
        } catch (error) {
            throw new Error(error)
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
                const { message } = await response.json()
                throw new Error(message)
            }

            return await response.json()
        } catch (error) {
            throw new Error(error)
        }
    }

    async delete(id) {
        try {
            const response = await fetch(`${url}/cancel/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                const { message } = await response.json()
                throw new Error(message)
            }

            return await response.json()
        } catch (error) {
            throw new Error(error)
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
                const { message } = await response.json()
                throw new Error(message)
            }

            return await response.json()
        } catch (error) {
            throw new Error(error)
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
                const { message } = await response.json()
                throw new Error(message)
            }

            return await response.json()
        } catch (error) {
            throw new Error(error)
        }
    }
}