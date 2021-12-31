import { User, LocalUser } from '../../database/models'
import { comparePassword } from '../hashing'
import dotenv from 'dotenv'

dotenv.config();

const LocalStrategy = require('passport-local').Strategy;

const localStrategy = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
},
  async (email: string, password: string, done: any) => {

    try {

      const localUser = await LocalUser.findOne({ where: { email }});

      if (localUser) { // User in database
        
        if (comparePassword(password, localUser.password, localUser.salt)) { // Password is correct

          const user = await User.findByPk(localUser.user_id);

          return done(null, user);

        } else return done(null, null, 'invalid-email-or-password');

      } else return done(null, null, 'invalid-email-or-password');

    } catch (error) {
      return done(error, null);
    }
  }
);

export default localStrategy;