import { urlProvider as url } from "./api";

export class Providers {

    constructor() {
        this.token = localStorage.getItem('authToken')
        this.url = new URL(url)
    }

    async get({ providerId = null, page = 1 }) {

        if (providerId) {
            this.url.searchParams.set('page', page);
            this.url.searchParams.set('providerId', providerId);
        }

        try {
            const response = await fetch(`${this.url}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw error;
            }

            return await response.json();

        } catch (error) {
            throw error
        }
    }

    async add(data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                body: data
            })

            if (!response.ok) {
                const error = await response.json();
                throw error;
            }
            return response.json()

        } catch (error) {
            throw error
        }
    }

    async edit() {

    }
}