import { urlCategories as url } from "./api"

export const categories = {
    get: async ({ code = null }) => {

        if (code) {
            const response = await fetch(`${url}/${code}`)
            return await response.json()
        }

        const response = await fetch(url)
        return await response.json()
    }
}