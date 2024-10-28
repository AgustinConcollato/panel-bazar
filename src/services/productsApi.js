import { urlProducts as url } from "./api"

export const products = {
    search: async ({ options = {}, id = null }) => {
        if (id) {
            const response = await fetch(`${url}/${id}`)
            return await response.json()
        }

        const { page, category } = options

        url.searchParams.set('page', page)
        url.searchParams.set('category', category)

        const response = await fetch(url)
        return await response.json()
    },

    add: async ({ data, token }) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': token,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: data,
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json(); 
                throw new Error(JSON.stringify(errorData)); 
            }

            return await response.json();

        } catch (error) {
            console.error('Error en la solicitud:', JSON.parse(error.message)); 
            throw error; 
        }
    }
}