import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";

export const AppDataContext = createContext()

export function AppDataProvider({ children }) {

    const { Categories, Providers } = api

    const [categories, setCategories] = useState(null)
    const [providers, setProviders] = useState(null);

    async function getCategories() {
        try {
            const categories = new Categories()
            setCategories(await categories.get({}))
        } catch (error) {
            console.log(error)
        }
    }
    async function getProviders() {
        try {
            const providers = new Providers()
            const data = await providers.get({})
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
