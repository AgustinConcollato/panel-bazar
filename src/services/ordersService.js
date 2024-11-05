import { url } from "./api";

export class Order {
    constructor() { }

    async create({ data }) {
        const response = await fetch(url + '/order', {
            method: 'POST',
            body: data
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }

        return await response.json()
    }

    async pending(id = null) {

        if (id) {
            const response = await fetch(`${url}/order/pending/${id}`)

            return await response.json()
        }

        const response = await fetch(`${url}/order/pending`)
        return await response.json()
    }

    async completed(id = null) {

        const time = new Date()

        const currentMonthStart = new Date(time.getFullYear(), time.getMonth(), 1).getTime()
        const currentMonthEnd = new Date(time.getFullYear(), time.getMonth() + 1, 0).getTime()

        if (id) {
            const response = await fetch(`${url}/order/completed/${id}?currentMonthStart=${currentMonthStart}&currentMonthEnd=${currentMonthEnd}`)

            return await response.json()
        }

        const response = await fetch(`${url}/order/completed?currentMonthStart=${currentMonthStart}&currentMonthEnd=${currentMonthEnd}`)
        return await response.json()
    }
}