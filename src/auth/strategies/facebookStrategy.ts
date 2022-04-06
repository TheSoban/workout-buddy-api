import { User, FacebookUser } from '../../database/models'
import dotenv from 'dotenv'

dotenv.config();

const FacebookStrategy = require('passport-facebook').Strategy;

const facebookStrategy = new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/auth/facebook/callback`,
  profileFields: ['email', 'id', 'first_name', 'last_name', 'picture'],
},
  async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    
    try {

      const facebookUser = await FacebookUser.findByPk(profile.id);

      if (facebookUser) { // User already in database

        const user = await User.findByPk(facebookUser.user_id);

        return done(null, user);

      } else { // User needs to be created

        const newUser = await User.create({
          provider: 'facebook'
        });

        const newFacebookUser = await FacebookUser.create({
          facebook_id: profile.id,
          display_name: `${profile.name.givenName} ${profile.name.familyName}`,
          family_name: profile.name.familyName,
          given_name: profile.name.givenName,
          avatar_url: profile.photos[0].value || '',
          email: profile.emails[0].value || '',
          user_id: newUser.user_id,
        });

        return done(null, newUser);
        
      }
    } catch (error) {
      return done(error, null);
    }
  }
);

export default facebookStrategy;