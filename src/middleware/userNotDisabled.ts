import express from 'express'
import { APIUser } from '../auth/interfaces'

const userNotDisabled = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { disabled } = req.user as APIUser;

  if (!disabled) return next();
  return res.status(400).json({
    status: 'error',
    response: {
      message: 'user-disabled'
    }
  });
}

export default userNotDisabled;