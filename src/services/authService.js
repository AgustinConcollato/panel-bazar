import { url } from './api'

export class Auth {
    constructor() {
        this.email = 'panelbazar@gmail.com'
    }

    async login(password) {
        const response = await fetch(`${url}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.email,
                password
            }),
        })

        if (!response.ok && response.status == 401) {
            throw new Error('Contraseña incorrecta - 401');
        }

        return await response.json()
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