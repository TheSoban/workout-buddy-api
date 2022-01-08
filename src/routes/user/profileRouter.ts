import dotenv from 'dotenv'
import express, { Router } from 'express'
import { body } from 'express-validator'
import { userAuthenticated, validParameters, userCompleted, userNotDisabled } from '../../middleware'
import { User } from '../../database/models'
import { APIUser } from '../../auth/interfaces'

dotenv.config();

export const profileRouter = Router()

.get("/", userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response) => {
  
  const { user_id } = req.user as APIUser;

  const { height, sex, date_of_birth } = await User.findByPk(user_id);

  res.status(200).json({
    status: 'success',
    response: {
      message: 'user-profile-found',
      profile: { height, sex, date_of_birth }
    }
  });
})


.post('/', userAuthenticated, userNotDisabled, [
  body('height').isInt(),
  body('sex').trim().isIn(["M", "F", "O"]),
  body('date_of_birth').isDate().escape()
], validParameters, async (req: express.Request, res: express.Response, next: any) => {
  try {

    const { user_id } = req.user as APIUser;
    
    const { height, sex, date_of_birth } = req.body;

    const updatedUser = await User.update({
      height,
      sex,
      date_of_birth,
      completed: true
    }, {
      where: { user_id }
    });

    return res.status(200).json({
      status: 'success',
      response: {
        message: 'user-profile-created'
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      response: {
        message: 'server-fail'
      }
    });
  }
});