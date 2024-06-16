import { Routes, Route } from "react-router-dom"
import { Signup } from "./components/signup"
import { Signin } from "./components/signin"
import { Send } from "./components/send"
export const AppRoutes = () => {
    return(
        <Routes>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/signin" element={<Signin />}></Route>
            <Route path="/send" element={<Send />}></Route>
        </Routes>
    )
}