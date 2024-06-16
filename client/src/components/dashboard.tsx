import { useGetAllUsers } from "@/api/user"
import { Header } from "./header"
import { LoaderIcon } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Link } from "react-router-dom"
import { useGetBalance } from "@/api/transaction"
import { useState } from "react"

export const Dashboard = () => {
    const [ searchQuery, setSearchQuery ] = useState<string>("")
    const { data: allUsersData, isPending: usersPending, isError: usersError } = useGetAllUsers(searchQuery)
    const { data: balanceData, isPending: balancePending, error: balanceError} = useGetBalance()
    
    return(
        <div className="min-h-screen flex flex-col gap-6">
            <Header />
            {usersPending ? (
                <main className="flex-1 container flex flex-col items-center justify-center">
                    <LoaderIcon className="h-4 w-4 animate-spin" />
                </main>
            ): (
                usersError ? (
                    <main className="flex-1 flex flex-col container items-center justify-center">
                        Some error occured
                    </main>
                ): (
                    <main className="flex-1 container">
                        <span className="flex items-center gap-3">
                            {balancePending ? (
                                <div className="flex flex-row gap-1 items-center">
                                    <p className="text-xl font-semibold">Available balance</p>
                                    <LoaderIcon className="h-4 w-4 animate-spin" />
                                </div>
                            ): (
                                balanceError ? (
                                    <span>{balanceError.message}</span>
                                ): (
                                    <p className="text-xl font-semibold mb-2">Available balance: 
                                        ₹{balanceData.balance / 100}
                                    </p>
                                )
                            )}
                        </span>
                        <Input placeholder="Enter recipient's name here" onChange={(e) => setSearchQuery(e.target.value)} />
                        <div className="flex flex-col gap-4 flex-1 py-6">
                            {
                               allUsersData.users.map((user, index) => (
                                    <div className="grid grid-cols-[1fr_auto]" key={index}>
                                        <div className="flex flex-row items-center gap-1">
                                            <Button className="rounded-full bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground">
                                                {user.firstName[0].toUpperCase()}
                                            </Button>
                                            {user.firstName}
                                        </div>
                                        <Button className="max-w-auto">
                                            <Link to={`/send/?id=${user.id}&name=${user.firstName}`}>Send money</Link>
                                        </Button>
                                    </div>
                                ))
                            }
                        </div>
                    </main>
                )
            )}
        </div>
    )
}