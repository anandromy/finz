import { Request, Response, NextFunction, request } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import "dotenv/config"

declare global{
    namespace Express {
        interface Request {
            userId: string
        }
    }
}

const secret = process.env.SECRET
export const jwtCheck = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["auth_token"]
    if(!token){
        return res.status(401).json({ message: "Unauthorized" })
    }
    try{
        const decoded = jwt.verify(token, secret as string)
        req.userId = (decoded as JwtPayload).userId as string
        next()
    } catch (error){
        return res.status(500).json({ message: "Some internal error occured"})
    }
}