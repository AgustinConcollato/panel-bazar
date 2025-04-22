import { urlProducts as url } from "./api";

export class Products {
    constructor() {
        this.token = localStorage.getItem('authToken')
        this.url = new URL(url)
    }

    async search({ options = {}, id = null }) {

        this.url.search = ''

        if (id) {
            const { panel } = options

            if (panel) {
                this.url = new URL(`${url}/${id}?panel=${panel}`)
            }
            else {
                this.url = new URL(`${url}/${id}`)
            }

            const response = await fetch(this.url);
            return await response.json();
        }

        Object.entries(options).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                this.url.searchParams.set(key, value);
            }
        });

        const response = await fetch(this.url);
        return await response.json();
    }

    async add({ data }) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                body: data
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
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(data)
            });

            return await response.json();

        } catch (error) {
            console.log(error);
        }
    }

    async updateImage({ id, data, type }) {

        const urlUpdateImages = type == 'add' ? `${url}/image-add/${id}` : `${url}/image-update/${id}`

        try {
            const response = await fetch(urlUpdateImages, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                body: data
            });

            if (!response.ok) {
                throw new Error();
            }

            return await response.json();

        } catch (error) {
            throw error;
        }
    }

    async deleteImage({ id, index }) {
        try {
            const response = await fetch(`${url}/image-delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ index })
            });

            if (!response.ok) {
                throw new Error();
            }

            return await response.json();

        } catch (error) {
            throw error;
        }
    }

    async delete({ id }) {
        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });

        return await response.json();
    }
}
