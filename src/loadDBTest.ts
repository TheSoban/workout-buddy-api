import { User, LocalUser, Exercise } from './database/models'
import { generateSalt, hashPassword } from './auth/hashing'

export const loadDBTest = async () => {
  {
    const salt = generateSalt();

    const hashedPassword = hashPassword('admin', salt);

    const newUser = await User.create({
      provider: 'local',
      completed: true,
      role: 2,
      height: 180,
      sex: 'M',
      date_of_birth: '2000-01-01'
    });

    const newLocalUser = await LocalUser.create({
      username: 'admin',
      avatar_url: null,
      email: 'admin@admin.com',
      password: hashedPassword,
      salt,
      user_id: newUser.user_id,
    });
  }
  {
    const salt = generateSalt();

    const hashedPassword = hashPassword('mod', salt);

    const newUser = await User.create({
      provider: 'local',
      completed: true,
      role: 1,
      height: 180,
      sex: 'M',
      date_of_birth: '2000-01-01'
    });

    const newLocalUser = await LocalUser.create({
      username: 'mod',
      avatar_url: null,
      email: 'mod@mod.com',
      password: hashedPassword,
      salt,
      user_id: newUser.user_id,
    });
  }
  {
    const salt = generateSalt();

    const hashedPassword = hashPassword('normal', salt);

    const newUser = await User.create({
      provider: 'local',
      completed: true,
      role: 0,
      height: 180,
      sex: 'M',
      date_of_birth: '2000-01-01'
    });

    const newLocalUser = await LocalUser.create({
      username: 'normal',
      avatar_url: null,
      email: 'normal@normal.com',
      password: hashedPassword,
      salt,
      user_id: newUser.user_id,
    });
  }
  {
    const newExercise = await Exercise.create({
      name: 'przysiady',
      description: 'siadanie i wstawanie',
      version: 1,
      author_id: 1
    })
  }
  {
    const newExercise = await Exercise.create({
      name: 'inne cwiczenia',
      description: 'wszystko i nic',
      version: 1,
      author_id: 2
    })
  }
}