import { User, GoogleUser } from '../../database/models'
import dotenv from 'dotenv'

dotenv.config();

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const googleStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
},
  async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {

    try {

      const googleUser = await GoogleUser.findByPk(profile.id);

      if (googleUser) { // User already in database

        const user = await User.findByPk(googleUser.user_id);

        return done(null, user);

      } else { // User needs to be created

        const newUser = await User.create({
          provider: 'google'
        });

        const newGoogleUser = await GoogleUser.create({
          google_id: profile.id,
          display_name: profile.displayName,
          family_name: profile.name.familyName,
          given_name: profile.name.givenName,
          avatar_url: profile?.photos?.[0]?.value,
          email: profile?.emails?.[0]?.value,
          user_id: newUser.user_id,
        });

        return done(null, newUser);
        
      }
    } catch (error) {
      return done(error, null);
    }
  }
);

export default googleStrategy;