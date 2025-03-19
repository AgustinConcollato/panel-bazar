import { urlShoppingCart } from './api'

export class ShoppingCart {
    constructor(parameters) { }

    async add(data) {

        const response = await fetch(urlShoppingCart, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        return await response.json()
    }

    async update(data) {

        const response = await fetch(urlShoppingCart, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        return await response.json()
    }

    async get(userId) {

        const response = await fetch(`${urlShoppingCart}/${userId}`)

        return await response.json()
    }

    async delete({ userId, productId }) {

        const response = await fetch(`${urlShoppingCart}/${userId}/${productId}`, {
            method: 'DELETE'
        })

        return await response.json()
    }

    async confirm(data) {

        const response = await fetch(`${urlShoppingCart}/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error()
        }

        const { order_id } = await response.json()
        return order_id
    }
}