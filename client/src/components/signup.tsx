import { Link, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeOffIcon, EyeIcon } from "lucide-react"
import { useState } from "react"
import { useCreateUser } from "@/api/user"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

export const signUpFormSchema = z.object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z.string().email({ message: "Enter valid email" }),
    password: z.string().trim().min(6, "Password should be of atleast 6 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Your passwords don't match",
    path: ["confirmPassword"]
})

export const Signup = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [ showPassword, setShowPassword ] = useState<boolean>(false)
    const [ showConfirmPassword, setShowConfirmPassword ] = useState<boolean>(false)
    const { register, formState: { errors }, handleSubmit } = useForm<z.infer<typeof signUpFormSchema>>({
        resolver: zodResolver(signUpFormSchema)
    })

    const { mutate: createUser , isPending } = useCreateUser()
    const onSubmit = handleSubmit((data) => {
        createUser(data, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [ "getUser" ]})
                navigate("/send")
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })
        
    })

    return(
        <div className="min-h-screen flex flex-col items-center justify-center">
            <form className="flex flex-col gap-3 w-[350px]" onSubmit={onSubmit}>
                <label className="font-semibold">First name
                    <Input {...register("firstName")} placeholder="Margot" className="mt-1 font-normal focus-visible:ring-offset-0 focus-visible:ring-0" />
                    {errors.firstName && (
                        <span className="text-destructive text-sm">{errors.firstName.message}</span>
                    )}
                </label>
                <label className="font-semibold">Last name
                    <Input {...register("lastName")} placeholder="Robbie" className="mt-1 font-normal focus-visible:ring-offset-0 focus-visible:ring-0" />
                    {errors.lastName && (
                        <span className="text-destructive text-sm">{errors.lastName.message}</span>
                    )}
                </label>
                <label className="font-semibold">Email
                    <Input {...register("email")} placeholder="random@gmail.com" className="mt-1 font-normal focus-visible:ring-offset-0 focus-visible:ring-0"/>
                    {errors.email && (
                        <span className="text-destructive text-sm">{errors.email.message}</span>
                    )}
                </label>
                <label className="font-semibold">Password
                    <div className="flex flex-row items-center gap-1 border rounded-lg pr-3 mt-1">
                        <Input {...register("password")} type={showPassword ? "text" : "password"} className="font-normal focus-visible:ring-offset-0 focus-visible:ring-0 border-0" />
                        <span className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                            {
                                showPassword ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />
                            }
                        </span>
                    </div>
                    {errors.password && (
                        <span className="text-destructive text-sm">{errors.password.message}</span>
                    )}
                </label>
                <label className="font-semibold">Confirm password
                    <div className="flex flex-row items-center gap-1 border rounded-lg pr-3 mt-1">
                        <Input {...register("confirmPassword")} type={showConfirmPassword ? "text" : "password"} className="font-normal focus-visible:ring-offset-0 focus-visible:ring-0 border-0" />
                        <span className="cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {
                                showConfirmPassword ? <EyeIcon className="h-4 w-4" /> : <EyeOffIcon className="h-4 w-4" />
                            }
                        </span>
                    </div>
                    {errors.confirmPassword && (
                        <span className="text-destructive text-sm">{errors.confirmPassword.message}</span>
                    )}
                </label>
                <Button disabled={isPending}>Submit</Button>
            </form>
            <span className="text-muted-foreground mt-2">
                Already signed up?
                <Link to="/signin" className="underline ml-1">Signin</Link>
            </span>
        </div>
    )
}