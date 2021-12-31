import { User, GithubUser } from '../../database/models'
import dotenv from 'dotenv'

dotenv.config();

const GitHubStrategy = require('passport-github').Strategy;

const githubStrategy = new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/auth/github/callback`,
  scope: 'user:email'
},
  async (_accessToken: string, _refreshToken: string, fullProfile: any, done: any) => {
    
    try {

      const profile = fullProfile._json;

      const githubUser = await GithubUser.findByPk(profile.id);

      if (githubUser) { // User already in database

        const user = await User.findByPk(githubUser.user_id);

        return done(null, user);

      } else { // User needs to be created

        const newUser = await User.create({
          provider: 'github'
        });

        const newGithubUser = await GithubUser.create({
          github_id: profile.id,
          username: profile.login,
          avatar_url: profile?.avatar_url,
          email: profile?.email,
          user_id: newUser.user_id
        });

        return done(null, newUser);
        
      }
    } catch (error) {
      return done(error, null);
    }
  }
);

export default githubStrategy;