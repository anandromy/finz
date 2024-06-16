import { getUser } from "@/api/user"
import { useQuery } from "@tanstack/react-query"
import React, { useContext, createContext } from "react"

type appContext = {
    isPending: boolean,
    user: {
        firstName: string,
        lastName: string,
        email: string
    }
}

const AppContext = createContext<appContext | undefined>(undefined)

export const AppContextProvider = ({ children }: { children: React.ReactNode}) => {
    const { isError, data, isPending } = useQuery({
        queryKey: ["getUser"],
        queryFn: () => getUser(),
        retry: false
    })

    return (
        <AppContext.Provider value={{
            user: isError ? undefined : {...data},
            isPending
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext)
    return context as appContext
}