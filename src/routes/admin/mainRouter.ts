import Sequelize from 'sequelize'
import express, { Router } from 'express'
import { body } from 'express-validator'
import { userAuthenticated, userAdmin, userCompleted, userNotDisabled, validParameters } from '../../middleware'
import { User, LocalUser, GithubUser, FacebookUser, GoogleUser } from '../../database/models'
import { APIUser } from '../../auth/interfaces'

export const mainRouter = Router()

.get("/user", userAuthenticated, userNotDisabled, userCompleted, userAdmin, async (req: express.Request, res: express.Response) => {
  try {

    const { user_id } = req.user as APIUser;

    const { Op } = Sequelize;

    const users = await User.findAll({
      where: {
        user_id: {
          [Op.not]: user_id
        }
      },
      include: [
        { model: GithubUser },
        { model: GoogleUser },
        { model: FacebookUser }, 
        { model: LocalUser },
      ]
    });
    
    return res.status(200).json({
      status: 'success',
      response: {
        message: 'users-found',
        users: users.map(user => ({
          user_id: user.user_id,
          provider: user.provider,
          username: user.provider === 'github' ? user.github_user.username :
                      user.provider === 'google' ? user.google_user.display_name :
                        user.provider === 'facebook' ? user.facebook_user.display_name :
                          user.provider === 'local' ? user.local_user.username : '',
          avatar_url: user.provider === 'github' ? user.github_user.avatar_url :
                        user.provider === 'google' ? user.google_user.avatar_url :
                          user.provider === 'facebook' ? user.facebook_user.avatar_url :
                            user.provider === 'local' ? user.local_user.avatar_url : '',
          role: user.role,
          disabled: user.disabled,
          completed: user.completed,
        }))
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

.get("/user/:user_id", userAuthenticated, userNotDisabled, userCompleted, userAdmin, async (req: express.Request, res: express.Response) => {
  try {

    const { user_id } = req.params;
  
    const user = await User.findByPk(user_id, {
      include: [
        { model: GithubUser },
        { model: GoogleUser },
        { model: FacebookUser }, 
        { model: LocalUser },
      ]
    });
    
    if (!user) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-user-id'
        }
      });
    }

    return res.status(200).json({
      status: 'success',
      response: {
        message: 'user-found',
        user
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

.post("/user/:user_id/update", userAuthenticated, userNotDisabled, userCompleted, userAdmin, [
  body('role').optional().trim().isIn(["standard", "moderator", "admin"]),
  body('disabled').optional().isBoolean()
], validParameters, async (req: express.Request, res: express.Response) => {
  try {

    const { user_id } = req.params;

    const { user_id: current_user_id } = req.user as APIUser;

    if (+user_id == current_user_id) return res.status(400).json({
      status: 'error',
      response: {
        message: 'admin-cannot-change-their-own-data'
      }
    });
    
    const user = await User.findByPk(user_id);

    await user.update(req.body);
    
    return res.status(200).json({
      status: 'success',
      response: {
        message: 'user-updated',
        user
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