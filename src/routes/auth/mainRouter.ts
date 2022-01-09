import express, { Router } from 'express'
import { userAuthenticated } from '../../middleware'

export const mainRouter = Router()

.get("/signout", userAuthenticated, (req: express.Request, res: express.Response) => {
  req.logout();
  res.status(200).json({
    status: 'success',
    response: {
      message: 'user-logged-out'
    }
  });
})