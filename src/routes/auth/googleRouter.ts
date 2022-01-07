import passport from 'passport'
import dotenv from 'dotenv'
import express, { Router } from 'express'
import { User } from '../../database/models'

dotenv.config();

export const googleRouter = Router()

.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }))

.get('/callback', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  passport.authenticate('google', (err: string, user: User, _info: string) => {
    if (err) return res.redirect(`${process.env.CLIENT_URL}/signin?status=${encodeURIComponent('signin-server-fail')}&provider=google`);

    if (!user) return res.redirect(`${process.env.CLIENT_URL}/signin?status=${encodeURIComponent('signin-client-fail')}&provider=google`);

    req.logIn(user, (loginErr) => {
      if (loginErr) return res.redirect(`${process.env.CLIENT_URL}/signin?status=${encodeURIComponent('signin-server-fail')}&provider=google`);

      if (user.disabled) return res.redirect(`${process.env.CLIENT_URL}?status=${encodeURIComponent('user-disabled')}&provider=google`);

      if (!user.completed) return res.redirect(`${process.env.CLIENT_URL}?status=${encodeURIComponent('user-incomplete')}&provider=google`);

      return res.redirect(`${process.env.CLIENT_URL}?status=${encodeURIComponent('signin-success')}&provider=google`);
    });
  })(req, res, next);
});