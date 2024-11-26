import { url } from "api-services"

export async function useCsrfToken() {
    const response = await fetch(`${url}/csrf-token`)
    return response.json()
}