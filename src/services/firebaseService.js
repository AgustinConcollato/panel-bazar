import { url } from "./api";

export class Firebase {
    constructor() { }

    async users() {
        const response = await fetch(url + '/firebase/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            }
        })

        return await response.json()
    }
}