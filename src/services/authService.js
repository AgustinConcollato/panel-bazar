import { url } from './api'

export class Auth {
    constructor() {
        this.email = 'panelbazar@gmail.com'
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

    async logout(token) {
        const response = await fetch(`${url}/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        return await response.json()
    }

}