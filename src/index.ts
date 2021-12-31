import session from 'express-session'
import passport from 'passport'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { body, validationResult } from 'express-validator'

import { sequelize } from './database'

import { User, GithubUser, GoogleUser, FacebookUser, LocalUser } from './database/models' 

import { githubStrategy, googleStrategy, facebookStrategy, localStrategy } from './auth/strategies'

import { generateSalt, hashPassword } from './auth/hashing'

import { APIUser } from './auth/interfaces'

dotenv.config();

(async () => {

  await sequelize.sync({ force: true });

  const app = express();

  app.use(express.json());
  
  //    __________  ____  _____
  //   / ____/ __ \/ __ \/ ___/
  //  / /   / / / / /_/ /\__ \ 
  // / /___/ /_/ / _, _/___/ / 
  // \____/\____/_/ |_|/____/  

  app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
  

  //    _____ ________________ ________  _   __
  //   / ___// ____/ ___/ ___//  _/ __ \/ | / /
  //   \__ \/ __/  \__ \\__ \ / // / / /  |/ / 
  //  ___/ / /___ ___/ /__/ // // /_/ / /|  /  
  // /____/_____//____/____/___/\____/_/ |_/   
                                       
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
      cookie: {
        sameSite: "strict",
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7  // one weak
      }
    })
  );

  //     ____  ___   __________ ____  ____  ____  ______
  //    / __ \/   | / ___/ ___// __ \/ __ \/ __ \/_  __/
  //   / /_/ / /| | \__ \\__ \/ /_/ / / / / /_/ / / /   
  //  / ____/ ___ |___/ /__/ / ____/ /_/ / _, _/ / /    
  // /_/   /_/  |_/____/____/_/    \____/_/ |_| /_/     

  app.use(passport.initialize());

  app.use(passport.session());

  passport.serializeUser((user: APIUser, done) => done(null, user.user_id));
  
  passport.deserializeUser(async (userId: string, done) => {
    
    try {
      const user = await User.findByPk(userId, {
        include: [
          { model: GithubUser },
          { model: GoogleUser },
          { model: FacebookUser }, 
          { model: LocalUser },
        ]
      });

      if (user && user.provider == 'github' && user.github_user) {

        const foundUser: APIUser = {
          user_id: user.user_id,
          provider: user.provider,
          username: user.github_user.username,
          avatar_url: user.github_user.avatar_url,
          disabled: user.disabled,
          completed: user.completed,
        }
  
        return done(null, foundUser);

      } else if (user && user.provider == 'google' && user.google_user) {

        const foundUser: APIUser = {
          user_id: user.user_id,
          provider: user.provider,
          username: user.google_user.display_name,
          avatar_url: user.google_user.avatar_url,
          disabled: user.disabled,
          completed: user.completed,
        }
  
        return done(null, foundUser);

      } else if (user && user.provider == 'facebook' && user.facebook_user) {

        const foundUser: APIUser = {
          user_id: user.user_id,
          provider: user.provider,
          username: user.facebook_user.display_name,
          avatar_url: user.facebook_user.avatar_url,
          disabled: user.disabled,
          completed: user.completed,
        }
  
        return done(null, foundUser);

      } else if (user && user.provider == 'local' && user.local_user) {

        const foundUser: APIUser = {
          user_id: user.user_id,
          provider: user.provider,
          username: user.local_user.username,
          avatar_url: user.local_user.avatar_url,
          disabled: user.disabled,
          completed: user.completed,
        }
  
        return done(null, foundUser);

      } else return done('missing-user', null);
    } catch (error) {
      return done(error, null);
    }
  });

  passport.use(githubStrategy);
  passport.use(googleStrategy);
  passport.use(facebookStrategy);
  passport.use(localStrategy);

  //    __________________  ____  ______     ____  ___   __  __________  __
  //   / ____/  _/_  __/ / / / / / / __ )   / __ \/   | / / / /_  __/ / / /
  //  / / __ / /  / / / /_/ / / / / __  |  / / / / /| |/ / / / / / / /_/ / 
  // / /_/ // /  / / / __  / /_/ / /_/ /  / /_/ / ___ / /_/ / / / / __  /  
  // \____/___/ /_/ /_/ /_/\____/_____/   \____/_/  |_\____/ /_/ /_/ /_/   

  app.get('/auth/github', passport.authenticate('github'));

  app.get('/auth/github/callback', (req, res, next) => {
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

  //    __________  ____  ________    ______   ____  ___   __  __________  __
  //   / ____/ __ \/ __ \/ ____/ /   / ____/  / __ \/   | / / / /_  __/ / / /
  //  / / __/ / / / / / / / __/ /   / __/    / / / / /| |/ / / / / / / /_/ / 
  // / /_/ / /_/ / /_/ / /_/ / /___/ /___   / /_/ / ___ / /_/ / / / / __  /  
  // \____/\____/\____/\____/_____/_____/   \____/_/  |_\____/ /_/ /_/ /_/   

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/auth/google/callback', (req, res, next) => {
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

  //     _________   ________________  ____  ____  __ __    ____  ___   __  __________  __
  //    / ____/   | / ____/ ____/ __ )/ __ \/ __ \/ //_/   / __ \/   | / / / /_  __/ / / /
  //   / /_  / /| |/ /   / __/ / __  / / / / / / / ,<     / / / / /| |/ / / / / / / /_/ / 
  //  / __/ / ___ / /___/ /___/ /_/ / /_/ / /_/ / /| |   / /_/ / ___ / /_/ / / / / __  /  
  // /_/   /_/  |_\____/_____/_____/\____/\____/_/ |_|   \____/_/  |_\____/ /_/ /_/ /_/   

  app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

  app.get('/auth/facebook/callback', (req, res, next) => {
    passport.authenticate('facebook', (err, user: User, info) => {
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

  //     __    ____  _________    __       ___   __  __________  __
  //    / /   / __ \/ ____/   |  / /      /   | / / / /_  __/ / / /
  //   / /   / / / / /   / /| | / /      / /| |/ / / / / / / /_/ / 
  //  / /___/ /_/ / /___/ ___ |/ /___   / ___ / /_/ / / / / __  /  
  // /_____/\____/\____/_/  |_/_____/  /_/  |_\____/ /_/ /_/ /_/ 

  app.post('/auth/local/signin', (req, res, next) => {
    passport.authenticate('local', (err, user: User, info) => {
      if (err) return res.redirect(`${process.env.CLIENT_URL}/signin?status=${encodeURIComponent('signin-server-fail')}&provider=local`);

      if (!user && info) return res.redirect(`${process.env.CLIENT_URL}/signin?status=${encodeURIComponent(info)}&provider=local`);

      if (!user) return res.redirect(`${process.env.CLIENT_URL}/signin?status=${encodeURIComponent('signin-server-fail')}&provider=local`);

      req.logIn(user, (loginErr) => {
        if (loginErr) return res.redirect(`${process.env.CLIENT_URL}/signin?status=${encodeURIComponent('signin-server-fail')}&provider=local`);

        if (user.disabled) return res.redirect(`${process.env.CLIENT_URL}?status=${encodeURIComponent('user-disabled')}&provider=local`);

        if (!user.completed) return res.redirect(`${process.env.CLIENT_URL}?status=${encodeURIComponent('user-incomplete')}&provider=local`);

        return res.redirect(`${process.env.CLIENT_URL}?status=${encodeURIComponent('signin-success')}&provider=local`);
      });
    })(req, res, next);
  });

  app.post('/auth/local/signup', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }).trim().escape(),
    body('username').isLength({ min: 6 }).trim().escape()
  ], async (req: express.Request, res: express.Response, next: any) => {
    try {

      const errors = validationResult(req);

      if (!errors.isEmpty()) return res.redirect(`${process.env.CLIENT_URL}/signup?status=${encodeURIComponent('invalid-parameters')}&provider=local`);
      
      const { email, password, username } = req.body;

      const localUserByEmail = await LocalUser.findOne({ where: { email }});

      if (localUserByEmail) return res.redirect(`${process.env.CLIENT_URL}/signup?status=${encodeURIComponent('email-in-use')}&provider=local`);

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

      return res.redirect(`${process.env.CLIENT_URL}/signin?status=${encodeURIComponent('user-created')}&provider=local`);

    } catch (error) {
      return res.redirect(`${process.env.CLIENT_URL}/signup?status=${encodeURIComponent('signup-server-fail')}&provider=local`);
    }
  });
    
  //     ____  ____  __  ___________________
  //    / __ \/ __ \/ / / /_  __/ ____/ ___/
  //   / /_/ / / / / / / / / / / __/  \__ \ 
  //  / _, _/ /_/ / /_/ / / / / /___ ___/ / 
  // /_/ |_|\____/\____/ /_/ /_____//____/  

  app.get('/', (req, res) => res.status(200).json({
    status: 'success',
    response: {
      message: 'api-running'
    }
  }));

  app.get("/auth/logout", (req, res) => {
    req.logout();
    res.status(200).json({
      status: 'success',
      response: {
        message: 'user-logged-out'
      }
    });
  });

  app.get("/getuser", (req, res) => res.status(200).json({
    status: 'success',
    response: {
      user: req.user
    }
  }));
  
  app.listen(process.env.PORT, () => console.log('Workout Buddy API Started'));
})();