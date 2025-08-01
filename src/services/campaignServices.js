import { urlCampaigns as url } from './api'

export class Campaign {
    constructor() {
        this.token = localStorage.getItem('authToken')
        this.url = url
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
                const error = await response.json()
                throw error
            }

            return await response.json()

        } catch (error) {
            throw error
        }
    }

    async update(campaignId, data) {
        try {
            const response = await fetch(`${url}/${campaignId}`, {
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

    async get({ slug = null, status = null, page = 1 } = {}) {

        let fullUrl = url

        if (slug) {
            fullUrl += `/${slug}`
        }

        if (status) {
            fullUrl += `?stauts=true`
        }

        fullUrl += `?page=${page}`

        try {
            const response = await fetch(fullUrl, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                },
            })

            if (!response.ok) {
                const error = response.json()
                throw error
            }

            return response.json()

        } catch (error) {
            throw error
        }
    }

    async addProducts({ products, campaignId }) {

        const fullUrl = `${url}/${campaignId}/products`

        try {
            const response = await fetch(fullUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ products: products })
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

    async updateProduct({ data, campaignId, productId }) {
        try {
            const response = await fetch(`${url}/${campaignId}/${productId}`, {
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

    async deleteProduct({ campaignId, productId }) {
        try {
            const response = await fetch(`${url}/${campaignId}/${productId}`, {
                method: 'delete',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                },
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