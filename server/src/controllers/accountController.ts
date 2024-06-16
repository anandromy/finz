import { Request, Response } from 'express'
import { Account } from '../models/account'
import mongoose from 'mongoose'

const getBalance = async (req: Request, res: Response) => {
    try {
        const account = await Account.findOne({
            userId: req.userId
        })
        const balance = account?.balance
        res.status(200).json({ balance })
    } catch(error) {
        console.log("Error fetching account balance", error)
        res.status(500).json({ message: "Error fetching account balance" })
    }
}

// For balance transfer, we need to execute all the operations successfully and if any one of them fails, undo all the other operations

const transferBalance = async(req: Request, res: Response) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    const { amount, to } = req.body

    const account = await Account.findOne({ userId: req.userId }).session(session)

    if(!account || account.balance < amount){
        await session.abortTransaction()
        return res.status(400).json({ message: "Insufficient balance" })
    }

    const toAccount = await Account.findOne({ userId: to }).session(session)
    if(!toAccount){
        await session.abortTransaction()
        return res.status(404).json({ message: "No account found" })
    }

    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session)
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session)

    await session.commitTransaction()
    res.json({
        message: "Transfer successfull"
    })
}

export default {
    getBalance,
    transferBalance
}