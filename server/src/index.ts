import express from 'express'
import "dotenv/config"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from 'mongoose'
import { userRoute } from './routes/user'
import { accountRouter } from './routes/account'

const PORT = Number(process.env.PORT)
const db_url = process.env.DATABASE_URL
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: "http://127.0.0.1:5173"
}))

app.use("/api/v1/user", userRoute)
app.use("/api/v1/account", accountRouter)

app.listen(PORT, () => {
    console.log(`Server started listening at port ${PORT}`)
})

mongoose.connect(db_url as string).then(() => {
    console.log("Database connected")
})

