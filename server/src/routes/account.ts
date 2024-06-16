import express from 'express'
import { jwtCheck } from '../middlewares/jwtCheck'
import accountController from '../controllers/accountController'

export const accountRouter = express.Router()

accountRouter.get("/", jwtCheck, accountController.getBalance)
accountRouter.post("/transfer", jwtCheck, accountController.transferBalance)