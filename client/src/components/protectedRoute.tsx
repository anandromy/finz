import { useAppContext } from "@/context/appContext"
import { LoaderIcon } from "lucide-react"
import { Navigate, Outlet } from "react-router-dom"

export const ProtectedRoute = () => {
    const { user, isPending } = useAppContext()
    if(isPending){
        return(
            <div className="min-h-screen flex items-center justify-center">
                <LoaderIcon className="animate-spin" />
            </div>
        )
    }
   if(user){
    return <Outlet />
   }

   return <Navigate to="/signin" replace />
}