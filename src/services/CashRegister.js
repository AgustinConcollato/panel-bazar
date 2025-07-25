import { urlCashRegister as url } from './api'

export class CashRegister {
    constructor() {
        this.token = localStorage.getItem('authToken')
        this.url = new URL(url)
    }

    async create(data) {
        try {
            const response = await fetch(`${this.url}/create`, {
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

    async get(id = null) {

        if (id) {
            this.url = new URL(`${url}/${id}`)
        }

        try {
            const response = await fetch(this.url, {
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

    async deposit(data) {
        try {
            const response = await fetch(`${this.url}/deposit`, {
                method: 'POST',
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

    async withdraw(data) {
        try {
            const response = await fetch(`${this.url}/withdraw`, {
                method: 'POST',
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

    async transferMoney(data) {
        try {
            const response = await fetch(`${this.url}/transfer-money`, {
                method: 'POST',
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

    async movements(data) {

    }
}