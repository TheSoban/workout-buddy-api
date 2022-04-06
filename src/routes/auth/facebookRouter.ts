import passport from 'passport'
import dotenv from 'dotenv'
import express, { Router } from 'express'
import { User } from '../../database/models'

dotenv.config();

export const facebookRouter = Router()

.get('/', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }))

.get('/callback', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  passport.authenticate('facebook', (err: string, user: User, _info: string) => {
    if (err) return res.redirect(`${process.env.CLIENT_URL}/signin?status=${encodeURIComponent('signin-server-fail')}&provider=facebook`);

    if (!user) return res.redirect(`${process.env.CLIENT_URL}/signin?status=${encodeURIComponent('signin-client-fail')}&provider=facebook`);

    req.logIn(user, (loginErr) => {
      if (loginErr) return res.redirect(`${process.env.CLIENT_URL}/signin?status=${encodeURIComponent('signin-server-fail')}&provider=facebook`);

      if (user.disabled) return res.redirect(`${process.env.CLIENT_URL}?status=${encodeURIComponent('user-disabled')}&provider=facebook`);

      if (!user.completed) return res.redirect(`${process.env.CLIENT_URL}?status=${encodeURIComponent('user-incomplete')}&provider=facebook`);

      return res.redirect(`${process.env.CLIENT_URL}?status=${encodeURIComponent('signin-success')}&provider=facebook`);
    });
  })(req, res, next);
});