import express from 'express'
import { APIUser } from '../auth/interfaces'

const userCompleted = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { completed } = req.user as APIUser;

  if (completed) return next();
  return res.status(400).json({
    status: 'error',
    response: {
      message: 'user-not-completed'
    }
  });
}

export default userCompleted;