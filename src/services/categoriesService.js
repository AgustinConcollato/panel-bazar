import { urlCategories as url } from "./api"

export class Categories {
    constructor() { }

    async get({ code = null }) {
        if (code) {
            const response = await fetch(`${url}/${code}`)
            return await response.json()
        }

        const response = await fetch(url)
        return await response.json()
    }

}