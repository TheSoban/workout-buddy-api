import express, { Router } from 'express'
import { body } from 'express-validator'
import { userAuthenticated, validParameters, userCompleted, userNotDisabled } from '../../middleware'
import { User } from '../../database/models'
import { APIUser } from '../../auth/interfaces'

export const profileRouter = Router()

.get("/", userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response) => {
  try {
    
    const { user_id } = req.user as APIUser;

    const profile = await User.findByPk(user_id, {
      attributes: ['height', 'sex', 'date_of_birth']
    });

    return res.status(200).json({
      status: 'success',
      response: {
        message: 'profile-found',
        profile
      }
    });
  
  } catch {

    return res.status(500).json({
      status: 'error',
      response: {
        message: 'server-fail'
      }
    });

  }
})

.post('/', userAuthenticated, userNotDisabled, [
  body('height').isInt(),
  body('sex').trim().isIn(["M", "F", "O"]),
  body('date_of_birth').isDate()
], validParameters, async (req: express.Request, res: express.Response) => {
  try {

    const { user_id } = req.user as APIUser;

    const profile = await User.findByPk(user_id, {
      attributes: ['user_id', 'height', 'sex', 'date_of_birth']
    });

    await profile.update({
      ...req.body,
      completed: true
    });

    return res.status(200).json({
      status: 'success',
      response: {
        message: 'profile-completed',
        profile
      }
    });

  } catch {

    return res.status(500).json({
      status: 'error',
      response: {
        message: 'server-fail'
      }
    });

  }
})

.post('/update', userAuthenticated, userNotDisabled, userCompleted, [
  body('height').optional().isInt(),
  body('sex').optional().trim().isIn(["M", "F", "O"]),
  body('date_of_birth').optional().isDate().escape()
], validParameters, async (req: express.Request, res: express.Response) => {
  try {

    const { user_id } = req.user as APIUser;

    const profile = await User.findByPk(user_id, {
      attributes: ['user_id', 'height', 'sex', 'date_of_birth', 'createdAt', 'updatedAt']
    });

    await profile.update(req.body);

    return res.status(200).json({
      status: 'success',
      response: {
        message: 'profile-updated',
        profile
      }
    });

  } catch {

    return res.status(500).json({
      status: 'error',
      response: {
        message: 'server-fail'
      }
    });

  }
})

.post('/delete', userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response, next: any) => {
  try {

    const { user_id } = req.user as APIUser;

    const profile = await User.findByPk(user_id, {
      attributes: ['user_id', 'height', 'sex', 'date_of_birth', 'createdAt', 'updatedAt']
    });

    await profile.update({
      height: null,
      sex: null,
      date_of_birth: null,
      completed: false
    });

    return res.status(200).json({
      status: 'success',
      response: {
        message: 'profile-deleted',
        profile
      }
    });

  } catch {

    return res.status(500).json({
      status: 'error',
      response: {
        message: 'server-fail'
      }
    });
    
  }
})