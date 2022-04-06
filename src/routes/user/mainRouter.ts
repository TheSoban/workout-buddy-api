import express, { Router } from 'express'
import { userAuthenticated } from '../../middleware'

export const mainRouter = Router()

.get("/", userAuthenticated, (req: express.Request, res: express.Response) => res.status(200).json({
  status: 'success',
  response: {
    user: req.user
  }
}));