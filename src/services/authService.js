import { url } from './api'

export class Auth {
    constructor() {
        this.email = 'panelbazar@gmail.com'
        this.token = localStorage.getItem('authToken')
    }

    async login(password) {
        try {
            const response = await fetch(`${url}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.email,
                    password
                })
            })

            if (!response.ok) {
                const error = response.json()
                throw error
            }

            return await response.json()
        } catch (error) {
            throw error
        }
    }

    async logout() {
        const response = await fetch(`${url}/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        })

        return await response.json()
    }

    async auth() {
        try {
            const response = await fetch(`${url}/auth`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            })

            if (!response.ok) {
                const error = response.json()
                throw error
            }

            return await response.json()
        } catch (error) {
            throw error
        }
    }
}