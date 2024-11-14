import { urlClients as url } from "./api";

export class Clients {

    constructor() {
        this.token = localStorage.getItem('authToken')
    }

    async get(id = null) {
        try {
            if (id) {
                const response = await fetch(`${url}/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                })
                return await response.json()
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            })
            return await response.json()
        } catch (error) {
            console.log(error)
        }
    }

}
