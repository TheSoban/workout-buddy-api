import { User, LocalUser, Exercise, Comment, ExerciseCategory, Muscle, Equipment, BodyMeasurement, WorkoutBlueprint, OrderedExercise } from './database/models'
import { generateSalt, hashPassword } from './auth/hashing'

export const loadDBTest = async () => {
  try {
    const adminSalt = generateSalt();

    const adminHashedPassword = hashPassword('admin', adminSalt);

    const newAdminUser = await User.create({
      provider: 'local',
      completed: true,
      role: 'admin',
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
      role: 'moderator',
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
      role: 'standard',
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
      author_id: newAdminUser.user_id
    });

    const newExercise2 = await Exercise.create({
      name: 'Wyciskanie sztangi na ławce prostej',
      description: 'Intensywne wyciskanie',
      version: 1,
      author_id: newModUser.user_id
    });

    const newExercise3 = await Exercise.create({
      name: 'Wznosy hantli bokiem w opadzie',
      description: 'Machanie łapkami',
      version: 1,
      author_id: newAdminUser.user_id
    });

    const newExercise4 = await Exercise.create({
      name: 'Martwy ciąg klasyczny',
      description: 'Podnoszenie z ziemi bardzo ciężkich rzeczy',
      version: 1,
      author_id: newAdminUser.user_id
    });

    const newExercise5 = await Exercise.create({
      name: 'Ściąganie drążka wyciągu górnego nachwytem',
      description: 'Niby podciąganie, ale jednak kulturyści to lubią bardziej',
      version: 1,
      author_id: newModUser.user_id
    });

    const newComment1 = await Comment.create({
      content: "Fajne cwiczenie",
      author_id: newStandardUser.user_id,
      exercise_id: newExercise1.exercise_id,
    });

    const newComment2 = await Comment.create({
      content: 'Nie fajne cwiczenie',
      author_id: newStandardUser.user_id,
      exercise_id: newExercise2.exercise_id
    });

    const newComment3 = await Comment.create({
      content: 'Też mi sie nie podoba',
      author_id: newStandardUser.user_id,
      exercise_id: newExercise2.exercise_id
    });
    
    const newComment4 = await Comment.create({
      content: 'Złamałem sobie przy tym ręke, nie polecam',
      author_id: newStandardUser.user_id,
      exercise_id: newExercise3.exercise_id
    });
    
    const newComment5 = await Comment.create({
      content: 'Nie polecam :c',
      author_id: newStandardUser.user_id,
      exercise_id: newExercise4.exercise_id
    });
    
    const newComment6 = await Comment.create({
      content: 'Podniosłem 300kg kiedyś i mi ręce oderwało',
      author_id: newStandardUser.user_id,
      exercise_id: newExercise4.exercise_id
    });

    const newExerciseCategory1 = await ExerciseCategory.create({
      name: "Wolne ciężary",
      author_id: newModUser.user_id
    });

    const newExerciseCategory2 = await ExerciseCategory.create({
      name: "Maszyny",
      author_id: newModUser.user_id
    });

    const newExerciseCategory3 = await ExerciseCategory.create({
      name: "Kalistenika",
      author_id: newModUser.user_id
    });

    const newExerciseCategory4 = await ExerciseCategory.create({
      name: "Trójbój",
      author_id: newModUser.user_id
    });

    const newExerciseCategory5 = await ExerciseCategory.create({
      name: "Cardio",
      author_id: newModUser.user_id
    });

    await newExercise1.$set('categories', [newExerciseCategory1, newExerciseCategory4]);
    await newExercise2.$set('categories', [newExerciseCategory1, newExerciseCategory4]);
    await newExercise3.$set('categories', [newExerciseCategory1]);
    await newExercise4.$set('categories', [newExerciseCategory1, newExerciseCategory4]);
    await newExercise5.$set('categories', [newExerciseCategory2]);

    const newMuscle1 = await Muscle.create({
      name: "Naramienny",
      author_id: newModUser.user_id
    });

    const newMuscle2 = await Muscle.create({
      name: "Dwógłowy ramienia",
      author_id: newModUser.user_id
    });

    const newMuscle3 = await Muscle.create({
      name: "Piersiowy",
      author_id: newAdminUser.user_id,
    });

    const newMuscle4 = await Muscle.create({
      name: "Trójgłowy ramienia",
      author_id: newAdminUser.user_id,
    });

    const newMuscle5 = await Muscle.create({
      name: "Czworogłowy uda",
      author_id: newModUser.user_id,
    });

    await newExercise1.$set('muscles', [newMuscle5]);
    await newExercise2.$set("muscles", [newMuscle1, newMuscle3, newMuscle4]);
    await newExercise3.$set('muscles', [newMuscle1]);
    await newExercise4.$set('muscles', [newMuscle5]);
    await newExercise5.$set('muscles', [newMuscle1, newMuscle4]);

    const newEquipment1 = await Equipment.create({
      name: "Sztanga",
      author_id: newModUser.user_id,
    });

    const newEquipment2 = await Equipment.create({
      name: "Hantle",
      author_id: newAdminUser.user_id
    });

    const newEquipment3 = await Equipment.create({
      name: "Ławka prosta",
      author_id: newAdminUser.user_id
    });

    const newEquipment4 = await Equipment.create({
      name: "Wyciąg górny",
      author_id: newAdminUser.user_id
    });

    await newExercise1.$set('equipment', [newEquipment1]);
    await newExercise2.$set("equipment", [newEquipment1, newEquipment3]);
    await newExercise3.$set('equipment', [newEquipment2]);
    await newExercise4.$set('equipment', [newEquipment1]);
    await newExercise5.$set('equipment', [newEquipment4]);

    const newBodyMeasurements1 = await BodyMeasurement.create({
      weight: 78.2,
      water_percentage: 50,
      body_fat: 20,
      visceral_fat: 9,
      muscle: 60,
      bone_mass: 3,
      user_id: newModUser.user_id
    });

    const newBodyMeasurements2 = await BodyMeasurement.create({
      weight: 80.2,
      water_percentage: 50,
      body_fat: 20,
      visceral_fat: 9,
      muscle: 60,
      bone_mass: 3,
      user_id: newModUser.user_id
    });

    const newWorkoutBlueprint1 = await WorkoutBlueprint.create({
      name: 'Trening typ 1',
      description: 'Opis treningu testowego',
      color: 'blue',
      user_id: newModUser.user_id
    });
    
    const newOrderedExercise1 = await OrderedExercise.create({
      order: 1,
      exercise_id: newExercise1.exercise_id,
      blueprint_id: newWorkoutBlueprint1.blueprint_id
    });
    
    const newOrderedExercise2 = await OrderedExercise.create({
      order: 2,
      exercise_id: newExercise2.exercise_id,
      blueprint_id: newWorkoutBlueprint1.blueprint_id
    });
    
    const newOrderedExercise3 = await OrderedExercise.create({
      order: 3,
      exercise_id: newExercise3.exercise_id,
      blueprint_id: newWorkoutBlueprint1.blueprint_id
    });
  } catch (err) {
    console.log(err);
  }
}