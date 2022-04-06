import passport from 'passport'
import express, { Router } from 'express'
import { body } from 'express-validator'
import { User, LocalUser } from '../../database/models'
import { userNotAuthenticated, validParameters } from '../../middleware'
import { generateSalt, hashPassword } from '../../auth/hashing'

export const localRouter = Router()

.post('/signin', userNotAuthenticated, (req, res, next) => {
  passport.authenticate('local', (err: string, user: User, info: string) => {
    if (err) return res.status(500).json({
      status: 'error',
      response: {
        message: 'server-fail',
        provider: 'local'
      }
    });

    if (!user && info) return res.status(400).json({
      status: 'error',
      response: {
        message: info,
        provider: 'local'
      }
    });

    if (!user) return res.status(500).json({
      status: 'error',
      response: {
        message: 'server-fail',
        provider: 'local'
      }
    });

    req.logIn(user, (loginErr) => {
      if (loginErr) return res.status(500).json({
        status: 'error',
        response: {
          message: 'server-fail',
          provider: 'local'
        }
      });

      if (user.disabled) return res.status(200).json({
        status: 'success',
        response: {
          message: 'user-disabled',
          provider: 'local'
        }
      });

      if (!user.completed) return res.status(200).json({
        status: 'success',
        response: {
          message: 'user-incomplete',
          provider: 'local'
        }
      });

      return res.status(200).json({
        status: 'success',
        response: {
          message: 'user-authenticated',
          provider: 'local'
        }
      });
    });
  })(req, res, next);
})

.post('/signup', userNotAuthenticated, [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }).trim().escape(),
  body('username').isLength({ min: 6 }).trim().escape()
], validParameters, async (req: express.Request, res: express.Response, next: any) => {
  try {
    
    const { email, password, username } = req.body;

    const localUserByEmail = await LocalUser.findOne({ where: { email }});

    if (localUserByEmail) return res.status(400).json({
      status: 'error',
      response: {
        message: 'email-in-use'
      }
    });

    const salt = generateSalt();

    const hashedPassword = hashPassword(password, salt);

    const newUser = await User.create({
      provider: 'local'
    });

    const newLocalUser = await LocalUser.create({
      username,
      avatar_url: null,
      email,
      password: hashedPassword,
      salt,
      user_id: newUser.user_id,
    });

    return res.status(200).json({
      status: 'success',
      response: {
        message: 'user-created'
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