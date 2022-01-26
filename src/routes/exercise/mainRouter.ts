import Sequelize from 'sequelize'
import express, { Router } from 'express'
import { body } from 'express-validator'
import { userAuthenticated, userMod, userCompleted, userNotDisabled, validParameters } from '../../middleware'
import { Exercise, ExerciseImage, ExerciseCategory, Muscle, Comment, Equipment } from '../../database/models'
import { APIUser } from '../../auth/interfaces'

const isArrayOfUrlsValidator = (value: any) => {
  if (!Array.isArray(value)) throw new Error('Not an array');
  for (const element of value) {
    const url = new URL(element);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('Invalid URL');
  }
  return true;
}

const isArrayOfNumbersValidator = (value: any) => {
  if (!Array.isArray(value)) throw new Error('Not an array');
  for (const element of value) {
    if (!Number.isInteger(element)) throw new Error('Not a number');
  }
  return true;
}

const isArrayOfNumbers = (value: any) => {
  if (!Array.isArray(value)) return false;
  for (const element of value) {
    if (!Number.isInteger(element)) return false;
  }
  return true;
}

export const mainRouter = Router()

.get("/", userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response) => {
  try {

    const { Op } = Sequelize;

    let name_filter: string;
    let equipment_filter: string[];
    let muscle_filter: string[];
    let category_filter: string[];

    try {
      name_filter = <string>req.query.name || "";
      equipment_filter = (req.query.equipment) ? (<string>req.query.equipment).split(',') : [];
      muscle_filter = (req.query.muscles) ? (<string>req.query.muscles).split(',') : [];
      category_filter = (req.query.categories) ? (<string>req.query.categories).split(',') : [];

      console.log(name_filter, equipment_filter, muscle_filter, category_filter);
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-filter-format'
        }
      });
    }

    const exercises = await Exercise.findAll({
      where: { name: { [Op.like]: `%${name_filter}%` } },
      include: [
        equipment_filter.length ? { model: Equipment, where: { equipment_id: equipment_filter } } : { model: Equipment },
        muscle_filter.length ? { model: Muscle, where: { muscle_id: muscle_filter } } : { model: Muscle },
        category_filter.length ? { model: ExerciseCategory, where: { category_id: category_filter } } : { model: ExerciseCategory },
        { model: ExerciseImage },
        { model: Comment }, 
      ]
    });
    
    return res.status(200).json({
      status: 'success',
      response: {
        exercises
      }
    });

  } catch {

    return res.status(500).json({
      status: 'error',
      response: {
        message: 'server-fail'
      }
    });

  }
})

.get("/:exercise_id", userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response) => {
  try {

    const { exercise_id } = req.params;
  
    const exercise = await Exercise.findByPk(exercise_id, {});
    
    if (!exercise) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-exercise-id'
        }
      });
    }

    const comments = await exercise.$get('comments', <any>{ joinTableAttributes: [] });
    const images = await exercise.$get('images', <any>{ joinTableAttributes: [] });
    const equipment = await exercise.$get('equipment', <any>{ joinTableAttributes: [] });
    const muscles = await exercise.$get('muscles', <any>{ joinTableAttributes: [] });
    const categories = await exercise.$get('categories', <any>{ joinTableAttributes: [] });

    const { name, description, version } = exercise;

    return res.status(200).json({
      status: 'success',
      response: {
        exercise: { comments, images, equipment, muscles, categories, exercise_id, name, description, version }
      }
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 'error',
      response: {
        message: 'server-fail'
      }
    });

  }
})

.post("/", userAuthenticated, userNotDisabled, userCompleted, userMod, [
  body('name').isLength({ max: 50 }).trim().escape(),
  body('description').isLength({ max: 50 }).trim().escape(),
  body('version').isInt(),
  body('images').custom(isArrayOfUrlsValidator),
  body('equipment').custom(isArrayOfNumbersValidator),
  body('muscles').custom(isArrayOfNumbersValidator),
  body('categories').custom(isArrayOfNumbersValidator),
], validParameters, async (req: express.Request, res: express.Response) => {
  try {

    const { user_id } = req.user as APIUser;
    
    const { name, description, version, images, equipment, muscles, categories} = req.body;

    const newExercise = await Exercise.create({
      name, 
      description, 
      version,
      author_id: user_id
    });

    const newImages = await ExerciseImage.bulkCreate(images.map((imageURL: string, imageIdx: number) => ({ 
      url: imageURL,
      is_main: imageIdx === 0,
      exercise_id: newExercise.exercise_id
    })));

    const foundEquipment = await Equipment.findAll({ where: { equipment_id: equipment } });
    const foundMuscles = await Equipment.findAll({ where: { muscle_id: muscles } });
    const foundCategories = await Equipment.findAll({ where: { category_id: categories } });

    await newExercise.$set('images', newImages);
    await newExercise.$set('equipment', foundEquipment);
    await newExercise.$set('muscles', foundMuscles);
    await newExercise.$set('categories', foundCategories);
    
    return res.status(200).json({
      status: 'success',
      response: {
        exercise: {
          exercise_id: newExercise.exercise_id,
          name: newExercise.name,
          description: newExercise.description,
          version: newExercise.version
        }
      }
    });

  } catch {

    return res.status(500).json({
      status: 'error',
      response: {
        message: 'server-fail'
      }
    });

  }
})

.post("/:exercise_id/update", userAuthenticated, userNotDisabled, userCompleted, userMod, [
  body('name').optional().isLength({ max: 50 }).trim().escape(),
  body('description').optional().isLength({ max: 50 }).trim().escape(),
  body('version').optional().isInt(),
  body('images').custom(isArrayOfUrlsValidator),
  body('equipment').custom(isArrayOfNumbersValidator),
  body('muscles').custom(isArrayOfNumbersValidator),
  body('categories').custom(isArrayOfNumbersValidator),
], validParameters, async (req: express.Request, res: express.Response) => {
  try {

    const { exercise_id } = req.params;

    const { images, equipment, muscles, categories } = req.body;

    const oldExercise = await Exercise.findByPk(exercise_id, {
      attributes: ['exercise_id', 'name', 'description', 'version']
    });

    if (!oldExercise) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-exercise-id'
        }
      });
    }

    await oldExercise.update(req.body);

    const oldImages = await ExerciseImage.findAll({
      attributes: ['image_id'],
      include: { model: Exercise, where: { exercise_id: oldExercise.exercise_id } }
    });

    await ExerciseImage.destroy({ where: { image_id: oldImages.map(image => image.image_id) } });

    const newImages = await ExerciseImage.bulkCreate(images.map((imageURL: string, imageIdx: number) => ({ 
      url: imageURL,
      is_main: imageIdx === 0,
      exercise_id: oldExercise.exercise_id
    })));

    const foundEquipment = await Equipment.findAll({ where: { equipment_id: equipment } });
    const foundMuscles = await Equipment.findAll({ where: { muscle_id: muscles } });
    const foundCategories = await Equipment.findAll({ where: { category_id: categories } });

    await oldExercise.$set('images', newImages);
    await oldExercise.$set('equipment', foundEquipment);
    await oldExercise.$set('muscles', foundMuscles);
    await oldExercise.$set('categories', foundCategories);
    
    return res.status(200).json({
      status: 'success',
      response: {
        message: 'exercise-updated',
        exercise: oldExercise
      }
    });

  } catch {

    return res.status(500).json({
      status: 'error',
      response: {
        message: 'server-fail'
      }
    });

  }
})

.post("/:exercise_id/delete", userAuthenticated, userNotDisabled, userCompleted, userMod, async (req: express.Request, res: express.Response) => {
  try {

    const { exercise_id } = req.params;

    const oldExercise = await Exercise.findByPk(exercise_id);

    if (!oldExercise) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-exercise-id'
        }
      });
    }

    const oldImages = await ExerciseImage.findAll({
      attributes: ['image_id'],
      include: { model: Exercise, where: { exercise_id: oldExercise.exercise_id } }
    });

    await ExerciseImage.destroy({ where: { image_id: oldImages.map(image => image.image_id) } });

    await oldExercise.destroy();
    
    return res.status(200).json({
      status: 'success',
      response: {
        message: 'exercise-deleted',
        exercise: oldExercise
      }
    });

  } catch {

    return res.status(500).json({
      status: 'error',
      response: {
        message: 'server-fail'
      }
    });

  }
})