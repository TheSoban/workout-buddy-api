import session from 'express-session'
import passport from 'passport'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import { sequelize } from './database'

import { serialize, deserialize } from './auth/serialization'
import { githubStrategy, googleStrategy, facebookStrategy, localStrategy } from './auth/strategies'

import { githubRouter, googleRouter, facebookRouter, localRouter, mainRouter as mainAuthRouter } from './routes/auth'
import { bodyMeasurementRouter, profileRouter, mainRouter as mainUserRouter } from './routes/user';
import { mainRouter as mainExerciseRouter } from './routes/exercise'
import { loadDBTest } from './loadDBTest'

dotenv.config();

(async () => {

  await sequelize.sync({ force: true });

  // JUST FOR TESTING
  await loadDBTest();

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

  passport.serializeUser(serialize);
  
  passport.deserializeUser(deserialize);

  passport.use(githubStrategy);
  passport.use(googleStrategy);
  passport.use(facebookStrategy);
  passport.use(localStrategy);

    
  //     ____  ____  __  ___________________
  //    / __ \/ __ \/ / / /_  __/ ____/ ___/
  //   / /_/ / / / / / / / / / / __/  \__ \ 
  //  / _, _/ /_/ / /_/ / / / / /___ ___/ / 
  // /_/ |_|\____/\____/ /_/ /_____//____/ 
  
  app.use('/auth/github', githubRouter);
  app.use('/auth/google', googleRouter);
  app.use('/auth/facebook', facebookRouter);
  app.use('/auth/local', localRouter);
  app.use('/auth', mainAuthRouter);
  app.use('/user/body-measurement', bodyMeasurementRouter);
  app.use('/user/profile', profileRouter);
  app.use('/user', mainUserRouter);
  app.use('/exercise', mainExerciseRouter);

  app.get('/', (req: express.Request, res: express.Response) => res.status(200).json({
    status: 'success',
    response: {
      message: 'api-running'
    }
  }));
  
  app.listen(process.env.PORT, () => console.log('Workout Buddy API Started'));
})();