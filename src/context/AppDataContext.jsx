import { api, url } from "../services/api";
import { createContext, useEffect, useState } from "react";

export const AppDataContext = createContext()

export function AppDataProvider({ children }) {

    const { Categories } = api

    const [categories, setCategories] = useState(null)
    const [providers, setProviders] = useState(null);

    async function getCategories() {
        const categories = new Categories()
        setCategories(await categories.get({}))
    }
    async function getProviders() {
        try {
            const response = await fetch(`${url}/provider`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw error;
            }

            const data = await response.json();
            setProviders(data);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCategories()
        getProviders()
    }, [])


    return <AppDataContext.Provider value={{ categories, providers }}>{children}</AppDataContext.Provider>
}
