import { APIUser } from '../interfaces'
import { User, GithubUser, GoogleUser, FacebookUser, LocalUser } from '../../database/models' 

const deserialize = async (userId: string, done: (err: any, id?: any) => void) => {
    
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
        role: user.role,
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
        role: user.role,
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
        role: user.role,
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
        role: user.role,
        disabled: user.disabled,
        completed: user.completed,
      }

      return done(null, foundUser);

    } else return done('missing-user', null);
  } catch (error) {
    return done(error, null);
  }
}

export default deserialize;