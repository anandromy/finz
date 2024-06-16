import { Request, Response } from "express"
import { User } from "../models/user"
import jwt from "jsonwebtoken"
import "dotenv/config"
import bcrypt from "bcrypt"
import ms from "ms"
import { Account } from "../models/account"

const secret = process.env.SECRET

const createUser = async (req: Request, res: Response) => {
    try {
        const user = req.body
        const userExists = await User.findOne({ email: user.email })
        if(userExists){
            return res.status(403).json({ message: "An account with this email already exists" })
        }
        const newUser = new User(user)
        const token = jwt.sign({ userId: newUser._id }, secret as string)
        await newUser.save()

        const userAccount = new Account({
            userId: newUser._id,
            balance: 10000
        })
        await userAccount.save()
        res.cookie("auth_token", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: ms(' 2 days') })
        return res.status(201).json({ token, userId: newUser._id })
    } catch (error){
        console.log("Error creating user", error)
        res.status(500).json({ message: "Error creating user" })
    }
}

const loginUser = async (req: Request, res: Response) => {
    try{
        const userExists = await User.findOne({ email: req.body.email })
        if(!userExists){
            return res.status(404).json({ message: "User doesn't exists" })
        }
        const isMatch = await bcrypt.compare(req.body.password, userExists.password)
        if(!isMatch){
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const token = jwt.sign({ userId: userExists._id }, secret as string)
        res.cookie("auth_token", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: ms(' 2 days') })
        res.status(200).json({ message: "Logged in successfully" })
        
    } catch (error) {
        console.log("Error in loggin in", error)
        res.status(500).json({ message: "Some error occured" })
    }
    
}

const getUser = async(req: Request, res: Response) => {
    try{
        const user = await User.findOne({ _id: req.userId })
        if(user){
            return res.status(200).json({ firstName: user.firstName, lastName: user.lastName, email: user.email })
        }
    } catch (error){
        console.log("Error in getting user", error)
        res.status(500).json({ message: "Failed to retreive user" })
    }
}

const updateUser = async(req: Request, res: Response) => {
    try {
        await User.updateOne(req.body, {
            _id: req.userId
        })
        return res.status(200).json({ message: "updated successfully" })
    } catch (error){
        console.log("Error updating user", error)
        res.status(500).json({ message: "Error updating user" })
    }
}


const getAllUsers = async(req: Request, res: Response) => {
    try{
        const filter = req.query.filter || ""
        const users = await User.find({
            $or: [{
                firstName: {
                    $regex: filter,
                    $options: 'i'
                }
            }, {
                lastName: {
                    $regex: filter,
                    $options: 'i'
                }
            }]
        })

        res.json({ users: 
            users.map((user) => ({
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }))
        })
    } catch (error) {
        console.log("Error getting users", error)
        res.status(500).json({ message: "Error getting users" })
    }
}

const logOutUser = async(req: Request, res: Response) => {
    try{
        res.cookie("auth_token", "", { httpOnly: true, secure: true, sameSite: "none")
        res.sendStatus(200)
    } catch (error){
        console.log("Error in loggin out", error)
        res.status(500).json({ message: "Some error occured" })
    }
}


export default {
    createUser,
    loginUser,
    getUser,
    updateUser,
    getAllUsers,
    logOutUser
}