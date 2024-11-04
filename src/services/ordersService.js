import { url } from "./api";

export class Order {
    constructor() { }

    async create({ data }) {
        const response = await fetch(url + '/order', {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: data
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }

        return await response.json()
    }
}