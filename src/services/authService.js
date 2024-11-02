import { url } from './api'

export class Auth {
    constructor() {
        this.email = 'panelbazar@gmail.com'
    }

    async login(password) {

        const bodyData = {
            email: this.email,
            password
        };

        console.log("Enviando datos de login:", bodyData); // Agregado para depuración

        const response = await fetch(`${url}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData),
        })

        if (!response.ok && response.status == 401) {
            throw new Error('Contraseña incorrecta - 401');
        }

        return await response.json()

    }
}