import { User, LocalUser, Exercise, Comment, ExerciseCategory, Muscle, Equipment } from './database/models'
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

    const standardSalt = generateSalt();

    const standardHashedPassword = hashPassword('standard', standardSalt);

    const newStandardUser = await User.create({
      provider: 'local',
      completed: true,
      role: 0,
      height: 180,
      sex: 'M',
      date_of_birth: '2000-01-01'
    });

    await LocalUser.create({
      username: 'standard',
      avatar_url: null,
      email: 'standard@standard.com',
      password: standardHashedPassword,
      salt: standardSalt,
      user_id: newStandardUser.user_id,
    });

    const incompleteSalt = generateSalt();

    const incompleteHashedPassword = hashPassword('incomplete', incompleteSalt);

    const newIncompleteUser = await User.create({
      provider: 'local',
      role: 0,
    });

    await LocalUser.create({
      username: 'incomplete',
      avatar_url: null,
      email: 'incomplete@incomplete.com',
      password: incompleteHashedPassword,
      salt: incompleteSalt,
      user_id: newIncompleteUser.user_id,
    });

    const disabledSalt = generateSalt();

    const disabledHashedPassword = hashPassword('disabled', disabledSalt);

    const newDisabledUser = await User.create({
      provider: 'local',
      role: 0,
      disabled: true,
    });

    await LocalUser.create({
      username: 'disabled',
      avatar_url: null,
      email: 'disabled@disabled.com',
      password: disabledHashedPassword,
      salt: disabledSalt,
      user_id: newDisabledUser.user_id,
    });
    
    const newExercise1 = await Exercise.create({
      name: 'Przysiady',
      description: 'Siadanie i wstawanie',
      version: 1,
      author_id: 1
    });

    const newExercise2 = await Exercise.create({
      name: 'Wyciskanie sztangi na ławce prostej',
      description: 'Intensywne wyciskanie',
      version: 1,
      author_id: 2
    });

    const newComment1 = await Comment.create({
      content: 'Fajne cwiczenie',
      author_id: 2,
      exercise_id: 1
    });

    const newComment2 = await Comment.create({
      content: 'Nie fajne cwiczenie',
      author_id: 3,
      exercise_id: 2
    });

    const newComment3 = await Comment.create({
      content: 'Też mi sie nie podoba',
      author_id: 3,
      exercise_id: 2
    });

    const newExerciseCategory1 = await ExerciseCategory.create({
      name: "Ćwiczenia siłowe",
      author_id: 1
    });

    const newExerciseCategory2 = await ExerciseCategory.create({
      name: "Ćwiczenia wytrzymałościowe",
      author_id: 2
    });

    const newMuscle1 = await Muscle.create({
      name: "Barki",
      author_id: 1
    });

    const newMuscle2 = await Muscle.create({
      name: "Bicepsy",
      author_id: 2
    });

    const newEquipment1 = await Equipment.create({
      name: "Sztanga",
      author_id: 1
    });

    const newEquipment2 = await Equipment.create({
      name: "Hantle",
      author_id: 2
    });

    const newEquipment3 = await Equipment.create({
      name: "Ławka prosta",
      author_id: 2
    });

  } catch (err) {
    console.log(err);
  }
}