import express from 'express'
import { APIUser } from '../auth/interfaces'
import { User } from '../database/models'

const userMod = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { user_id } = req.user as APIUser;

  const user = await User.findByPk(user_id);

  if (user.role >= 1) return next();
  return res.status(400).json({
    status: 'error',
    response: {
      message: 'insufficient-permissions'
    }
  });
}

export default userMod;