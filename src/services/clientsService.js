import { urlClients as url } from "./api";

export class Clients {

    constructor() {
        this.token = localStorage.getItem('authToken')
        this.url = url
    }

    async get({ id = null, source = null }) {
        try {
            if (id) {
                const response = await fetch(`${this.url}/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                })
                return await response.json()
            }


            if (source) {
                this.url = `${this.url}?source=${source}`
            }

            const response = await fetch(this.url, {
                method: 'GET',
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
            console.log(error)
        }
    }

    async add(data) {
        try {
            const response = await fetch(`${this.url}/register/panel`, {
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

    async update({ id, data }) {
        try {
            const response = await fetch(`${this.url}/${id}`, {
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

    async search(clientName) {
        try {
            const response = await fetch(`${this.url}/search/${clientName}`, {
                headers: {
                    'Authtentication': `Bearer ${this.token}`
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
