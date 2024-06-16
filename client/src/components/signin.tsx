import { Link, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSigninUser } from "@/api/user"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

export const siginformSchema = z.object({
    email: z.string().email({ message: "Enter a valid email" }),
    password: z.string().trim().min(6, "Password should be of atleast 6 characters")
})

export const Signin = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { register, handleSubmit, formState: { errors }} = useForm<z.infer<typeof siginformSchema>>({
        resolver: zodResolver(siginformSchema)
    })
    const { mutate, isPending } = useSigninUser()
    const onSubmit = handleSubmit((data) => {
        mutate(data, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["getUser"]})
                navigate("/send")
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
    })
    return(
        <div className="min-h-screen flex flex-col items-center justify-center">
            <form className="flex flex-col gap-3 w-[300px]" onSubmit={onSubmit}>
                <label className="font-semibold">Email
                    <Input {...register("email")} placeholder="random@gmail.com" className="mt-1 font-normal focus-visible:ring-offset-0 focus-visible:ring-0"/>
                    {errors.email && (
                        <span className="text-destructive text-sm">{errors.email.message}</span>
                    )}
                </label>
                <label className="font-semibold">Password
                    <Input {...register("password")} type="password" className="mt-1 font-normal focus-visible:ring-offset-0 focus-visible:ring-0" />
                    {errors.password && (
                        <span className="text-destructive text-sm">{errors.password.message}</span>
                    )}
                </label>
                <Button disabled={isPending}>Submit</Button>
            </form>
            <span className="text-muted-foreground mt-2">New here?
                <Link to="/signup" className="underline ml-1">Signup</Link>
            </span>
        </div>
    )
}