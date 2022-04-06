import passport from 'passport'
import dotenv from 'dotenv'
import express, { Router } from 'express'
import { User } from '../../database/models'

dotenv.config();

export const githubRouter = Router()

.get('/', passport.authenticate('github'))

.get('/callback', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  passport.authenticate('github', (err: string, user: User, _info: string) => {
    if (err) return res.redirect(`${process.env.CLIENT_URL}/signin?status=${encodeURIComponent('signin-server-fail')}&provider=github`);

    if (!user) return res.redirect(`${process.env.CLIENT_URL}/signin?status=${encodeURIComponent('signin-client-fail')}&provider=github`);

    req.logIn(user, (loginErr) => {
      if (loginErr) return res.redirect(`${process.env.CLIENT_URL}/signin?status=${encodeURIComponent('signin-server-fail')}&provider=github`);

      if (user.disabled) return res.redirect(`${process.env.CLIENT_URL}?status=${encodeURIComponent('user-disabled')}&provider=github`);

      if (!user.completed) return res.redirect(`${process.env.CLIENT_URL}?status=${encodeURIComponent('user-incomplete')}&provider=github`);

      return res.redirect(`${process.env.CLIENT_URL}?status=${encodeURIComponent('signin-success')}&provider=github`);
    });
  })(req, res, next);
});