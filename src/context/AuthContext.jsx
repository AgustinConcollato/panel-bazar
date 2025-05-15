import { createContext, useEffect, useState } from "react";
import { api } from "../services/api";

export const AuthContext = createContext()

export function AuthProvider({ children }) {

    const { Auth } = api
    const auth = new Auth()

    const [user, setUser] = useState(null)


    async function login(password) {
        const user = await auth.login(password)
        localStorage.setItem('authToken', user.token)
        setUser(user.user)
        return user
    }

    useEffect(() => {
        (async () => {
            const user = await auth.auth()
            setUser(user)
        })()
    }, [])


    return <AuthContext.Provider value={{ user, login }}>{children}</AuthContext.Provider>
}
