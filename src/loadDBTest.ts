import { User, LocalUser, Exercise, Comment, ExerciseCategory, Muscle } from './database/models'
import { generateSalt, hashPassword } from './auth/hashing'

export const loadDBTest = async () => {
  try {
    const adminSalt = generateSalt();

    const adminHashedPassword = hashPassword('admin', adminSalt);

    const newAdminUser = await User.create({
      provider: 'local',
      completed: true,
      role: 2,
      height: 180,
      sex: 'M',
      date_of_birth: '2000-01-01'
    });

    await LocalUser.create({
      username: 'admin',
      avatar_url: null,
      email: 'admin@admin.com',
      password: adminHashedPassword,
      salt: adminSalt,
      user_id: newAdminUser.user_id,
    });

    const modSalt = generateSalt();

    const modHashedPassword = hashPassword('mod', modSalt);

    const newModUser = await User.create({
      provider: 'local',
      completed: true,
      role: 1,
      height: 180,
      sex: 'M',
      date_of_birth: '2000-01-01'
    });

    await LocalUser.create({
      username: 'mod',
      avatar_url: null,
      email: 'mod@mod.com',
      password: modHashedPassword,
      salt: modSalt,
      user_id: newModUser.user_id,
    });

    const normalSalt = generateSalt();

    const normalHashedPassword = hashPassword('normal', normalSalt);

    const newNormalUser = await User.create({
      provider: 'local',
      completed: true,
      role: 0,
      height: 180,
      sex: 'M',
      date_of_birth: '2000-01-01'
    });

    await LocalUser.create({
      username: 'normal',
      avatar_url: null,
      email: 'normal@normal.com',
      password: normalHashedPassword,
      salt: normalSalt,
      user_id: newNormalUser.user_id,
    });
    
    const newExercise1 = await Exercise.create({
      name: 'przysiady',
      description: 'siadanie i wstawanie',
      version: 1,
      author_id: 1
    });

    const newExercise2 = await Exercise.create({
      name: 'inne cwiczenia',
      description: 'wszystko i nic',
      version: 1,
      author_id: 2
    });

    const newComment1 = await Comment.create({
      content: 'fajne cwiczenie',
      author_id: 2,
      exercise_id: 1
    });

    const newComment2 = await Comment.create({
      content: 'nie fajne cwiczenie',
      author_id: 3,
      exercise_id: 2
    });

    const newComment3 = await Comment.create({
      content: 'tez mi sie nie podoba',
      author_id: 3,
      exercise_id: 2
    });

    const newExerciseCategory1 = await ExerciseCategory.create({
      name: "cwiczenia silowe",
      author_id: 1
    });

    const newExerciseCategory2 = await ExerciseCategory.create({
      name: "cwiczenia wytrzymalosciowe",
      author_id: 2
    });

    const newMuscle1 = await Muscle.create({
      name: "barki",
      author_id: 1
    });

    const newMuscle2 = await Muscle.create({
      name: "bicepsy",
      author_id: 2
    });
  } catch (err) {
    console.log(err);
  }
}