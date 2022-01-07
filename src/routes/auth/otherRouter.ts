import dotenv from 'dotenv'
import express, { Router } from 'express'
import { authRoute } from '../../middleware'

dotenv.config();

export const otherRouter = Router()

.get("/logout", authRoute, (req: express.Request, res: express.Response) => {
  req.logout();
  res.status(200).json({
    status: 'success',
    response: {
      message: 'user-logged-out'
    }
  });
})

.get("/getuser", authRoute, (req: express.Request, res: express.Response) => res.status(200).json({
  status: 'success',
  response: {
    user: req.user
  }
}));