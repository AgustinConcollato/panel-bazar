import { urlProducts as url } from "./api";

export class Products {
    constructor() {
        url.searchParams.delete('category');
        url.searchParams.delete('page');
        url.searchParams.delete('name');
    }

    async search({ options = {}, id = null }) {

        if (id) {
            const response = await fetch(`${url}/${id}`);
            return await response.json();
        }

        const { page, category, name } = options;

        if (!category) {
            url.searchParams.set('name', name);
        } else {
            url.searchParams.set('category', category);
        }

        url.searchParams.set('page', page);


        const response = await fetch(url);
        return await response.json();
    }

    async add({ data, token }) {
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

    async update({ id, data }) {
        try {
            const response = await fetch(`${url}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            return await response.json();

        } catch (error) {
            console.log(error);
        }
    }

    async updateImage({ id, images }) {
        try {
            const response = await fetch(`${url}/${id}`, {
                method: 'PUT',
                body: images
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

    async delete({ id }) {
        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE'
        });

        return await response.json();
    }
}
