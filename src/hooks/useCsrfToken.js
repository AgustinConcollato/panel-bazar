import { url } from "../services/api"

export async function useCsrfToken() {
    const response = await fetch(`${url}/csrf-token`)
    return response.json()
}