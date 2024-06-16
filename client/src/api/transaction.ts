import { useMutation, useQuery } from "@tanstack/react-query"

const api_base_url = import.meta.env.VITE_API_BASE_URL

export const useGetBalance = () => {
    const getBalanceQuery = async (): Promise<{
        balance: number
    }> => {
        const res = await fetch(`${api_base_url}/api/v1/account`, {
            headers: {
                "Content-Type" : "application/json"
            },
            credentials: "include"
        })
        if(!res.ok){
            throw new Error("Unable to fetch current balance")
        }
        return res.json()
    }

    const query = useQuery({
        queryKey: ["getBalance"],
        queryFn: getBalanceQuery
    })

    return query
}

export const useTransferMoney = (credentials: {
    amount: number,
    to: string
}) => {
    const transferBalanceMutation = async () => {
        const res = await fetch(`${api_base_url}/api/v1/account/transfer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials),
            credentials: "include"
        })
        if(!res.ok){
            const resErr = await res.json()
            throw new Error(resErr.message)
        }
        return res.json()
    }
    const mutation = useMutation({
        mutationFn: transferBalanceMutation
    })
    return mutation
}