import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { useLogoutUser } from "@/api/user"
import { useQueryClient } from "@tanstack/react-query"
import { useAppContext } from "@/context/appContext"
import { LoaderCircleIcon } from "lucide-react"

export const Header = () => {
    const queryClient = useQueryClient()
    const { mutate, isPending } = useLogoutUser()
    const { user, isPending: isLoadingUser } = useAppContext()
    return(
        <header className="py-6">
            <div className="flex container items-center justify-between">
                <Link to="/signin" className="text-3xl font-bold tracking-tight">finz</Link>
                {
                    isLoadingUser ? (
                        <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                    ): (
                        user ? (
                            <div className="flex items-center gap-6">
                                <Link to="/dashboard">Dashboard</Link>
                                <Button disabled={isPending} onClick={() => mutate(undefined, {
                                    onSuccess: async () => {
                                        await queryClient.invalidateQueries({
                                            queryKey: ["getUser"]
                                        })
                                    }
                                })}>Log out</Button>
                            </div>
                        ): (
                            <Button variant="ghost" asChild>
                                <Link to="/signin">Log in</Link>
                            </Button>
                        )
                    )
                }
            </div>
        </header>
    )
}