import { useSearchParams } from "react-router-dom"
import { Header } from "./header"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useTransferMoney } from "@/api/transaction"
import { toast } from "sonner"
import { useState } from "react"
import { LoaderIcon } from "lucide-react"

export const Send = () => {
    const [ params ] = useSearchParams()
    const name = params.get("name")
    const id = params.get("id")
    const [ amount, setAmount ] = useState<string>()
    const { mutate, isPending } = useTransferMoney({ amount: Number(amount), to: id || "" })

    const handleClick = () => {
        mutate(undefined, {
            onSuccess: () => {
                toast.success("Succefully sent")
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    }

    return(
        <div className="min-h-screen flex flex-col gap-6">
            <Header />
            <main className="flex-1 container flex items-center justify-center">
                <div className="lg:w-[400px] w-[350px] shadow-lg p-12 bg-muted">
                    <h2 className="text-3xl font-bold text-center mb-10">Send money</h2>
                    <div className="flex flex-row items-center gap-2 mb-3">
                        <Button className="rounded-full">{name && name[0].toUpperCase()}</Button>
                        <p className="font-semibold text-xl">{name}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">Amount (₹)</span>
                    <Input className="mt-1 mb-8" onChange={(e) => setAmount(e.target.value)}/>
                    <Button className="w-full" onClick={handleClick} disabled={isPending}>
                        {isPending ? (
                            <LoaderIcon className="h-4 w-4 animate-spin" />
                        ):(
                            "Initiate transfer"
                        )}
                    </Button>
                </div>
            </main>
        </div>
    )
}