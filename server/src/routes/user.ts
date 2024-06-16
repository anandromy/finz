import express from "express"
import userController from "../controllers/userController"
import { jwtCheck } from "../middlewares/jwtCheck"
export const userRoute = express.Router()

userRoute.post("/", userController.createUser)
userRoute.post("/login", userController.loginUser)
userRoute.get("/", jwtCheck, userController.getUser)
userRoute.put("/", jwtCheck, userController.updateUser)
userRoute.get("/getAll", jwtCheck, userController.getAllUsers)
userRoute.post("/logout", jwtCheck, userController.logOutUser)