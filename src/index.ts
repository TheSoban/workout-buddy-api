import session from 'express-session'
import passport from 'passport'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import { sequelize } from './database'

import { User, GithubUser } from './database/models' 

import { githubStrategy } from './auth/strategies'

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
          { model: GithubUser }
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

      } else return done('missing-user', null);
    } catch (error) {
      return done(error, null);
    }
  });

  passport.use(githubStrategy);

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