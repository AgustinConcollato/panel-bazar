import { urlCategories as url } from "./api"

export class Categories {
    constructor() { }

    async get({ code = null }) {
        try {
            if (code) {
                const response = await fetch(`${url}/${code}`)

                if (!response.ok) {
                    const error = await response.json()
                    throw error
                }

                return await response.json()
            }

            const response = await fetch(url)

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