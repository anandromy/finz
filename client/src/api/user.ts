import { siginformSchema } from "@/components/signin"
import { signUpFormSchema } from "@/components/signup"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Filter } from "lucide-react"
import { z } from "zod"


const api_base_url = import.meta.env.VITE_API_BASE_URL

type User = {
    email: string
    firstName: string
    lastName: string,
    id: string
}

export const useCreateUser = () => {
    const createUserRequest = async (data: z.infer<typeof signUpFormSchema>) => {
        const res = await fetch(`${api_base_url}/api/v1/user`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify(data)
        })
        if(!res.ok){
            const resErr = await res.json()
            throw new Error(resErr.message)
        }
        return res.json()
    }
    const mutation = useMutation({
        mutationFn: createUserRequest
    })

    return mutation
}

export const useSigninUser = () => {
    const signinUserRequest = async(data: z.infer<typeof siginformSchema>) => {
        const res = await fetch(`${api_base_url}/api/v1/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(data)
        })
        if(!res.ok){
            const resErr = await res.json()
            throw new Error(resErr.message)
        }
        return res.json()
    }
    const mutation = useMutation({
        mutationFn: signinUserRequest
    })

    return mutation
}

export const getUser = async() => {
    const res = await fetch(`${api_base_url}/api/v1/user`, {
        method: "GET",
        credentials: "include"
    })
    if(!res.ok){
        const resErr = await res.json()
        throw new Error(resErr.message)
    }
    return res.json()
}

export const useLogoutUser = () => {
    const logoutUserRequest = async() => {
        const res = await fetch(`${api_base_url}/api/v1/user/logout`, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            }
        })
        if(!res.ok){
            const resErr = await res.json()
            throw new Error(resErr.message)
        }
    }
    const mutation = useMutation({
        mutationFn: logoutUserRequest
    })

    return mutation
}

export const useGetAllUsers = (filter: string) => {
    const getAllUsersRequest = async(): Promise<{
        users: User[]
    }>=> {
        const params = new URLSearchParams()
        params.set("filter", filter)
        const res = await fetch(`${api_base_url}/api/v1/user/getAll/?${params.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
        if(!res.ok){
            const resErr = await res.json()
            throw new Error(resErr.message)
        }
        return res.json()
    }
    const query = useQuery({
        queryKey: ["getAllUsers", filter],
        queryFn: getAllUsersRequest
    })

    return query
}

