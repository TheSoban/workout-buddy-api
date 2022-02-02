import express, { Router } from 'express'
import { body } from 'express-validator'
import { userAuthenticated, userMod, userCompleted, userNotDisabled, validParameters } from '../../middleware'
import { Exercise, OrderedExercise, WorkoutBlueprint } from '../../database/models'
import { APIUser } from '../../auth/interfaces'

const isArrayOfNumbersValidator = (value: any) => {
  if (!Array.isArray(value)) throw new Error('Not an array');
  for (const element of value) {
    if (!Number.isInteger(element)) throw new Error('Not a number');
  }
  return true;
}

export const workoutBlueprintRouter = Router()

.get("/", userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response) => {
  try {

    const { user_id } = req.user as APIUser;

    const blueprints = await WorkoutBlueprint.findAll({
      where: { user_id },
      include: [
        { 
          model: OrderedExercise,
          include: [
            {
              model: Exercise
            }
          ]
        },
      ]
    });
    
    return res.status(200).json({
      status: 'success',
      response: {
        message: 'blueprints-found',
        blueprints
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

.get("/:blueprint_id", userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response) => {
  try {

    const { user_id } = req.user as APIUser;

    const { blueprint_id } = req.params;
  
    const blueprint = await WorkoutBlueprint.findOne({
      where: { user_id, blueprint_id },
      include: [
        { 
          model: OrderedExercise,
          include: [
            {
              model: Exercise
            }
          ]
        },
      ]
    });
    
    if (!blueprint) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-blueprint-id'
        }
      });
    }

    return res.status(200).json({
      status: 'success',
      response: {
        message: 'blueprint-found',
        blueprint
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

.post("/", userAuthenticated, userNotDisabled, userCompleted, [
  body('name').isLength({ max: 50 }).trim().escape(),
  body('description').isLength({ max: 300 }).trim().escape(),
  body('color').isLength({ max: 20 }).trim().escape(),
  body('exercises').custom(isArrayOfNumbersValidator),
], validParameters, async (req: express.Request, res: express.Response) => {
  try {

    const { user_id } = req.user as APIUser;
    
    const { name, description, color, exercises} = req.body;

    const newBlueprint = await WorkoutBlueprint.create({
      name, 
      description, 
      color,
      user_id
    });

    const newOrderedExercises = await OrderedExercise.bulkCreate(exercises.map((exerciseId: string, exerciseIdx: number) => ({ 
      order: exerciseIdx,
      exercise_id: exerciseId,
      blueprint_id: newBlueprint.blueprint_id
    })));

    await newBlueprint.$set('ordered_exercises', newOrderedExercises);
    
    return res.status(200).json({
      status: 'success',
      response: {
        message: 'blueprint-created',
        blueprint: newBlueprint
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

.post("/:blueprint_id/update", userAuthenticated, userNotDisabled, userCompleted, [
  body('name').optional().isLength({ max: 50 }).trim().escape(),
  body('description').optional().isLength({ max: 300 }).trim().escape(),
  body('color').optional().isLength({ max: 20 }).trim().escape(),
  body('exercises').optional().custom(isArrayOfNumbersValidator),
], validParameters, async (req: express.Request, res: express.Response) => {
  try {

    const { blueprint_id } = req.params;

    const { user_id } = req.user as APIUser;
    
    const { exercises } = req.body;

    const OldBlueprint = await WorkoutBlueprint.findOne({ where: { blueprint_id, user_id }});

    if (!OldBlueprint) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-blueprint-id'
        }
      });
    }

    await OldBlueprint.update(req.body);

    const OldExercises = await OrderedExercise.findAll({
      include: { model: WorkoutBlueprint, where: { blueprint_id: OldBlueprint.blueprint_id } }
    });

    await OrderedExercise.destroy({ where: { ordered_exercise_id: OldExercises.map(exercise => exercise.ordered_exercise_id) } });

    const newOrderedExercises = await OrderedExercise.bulkCreate(exercises.map((exerciseId: string, exerciseIdx: number) => ({ 
      order: exerciseIdx,
      exercise_id: exerciseId,
      blueprint_id: OldBlueprint.blueprint_id
    })));

    await OldBlueprint.$set('ordered_exercises', newOrderedExercises);
    
    return res.status(200).json({
      status: 'success',
      response: {
        message: 'blueprint-updated',
        blueprint: OldBlueprint
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

.post("/:blueprint_id/delete", userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response) => {
  try {

    const { blueprint_id } = req.params;

    const { user_id } = req.user as APIUser;

    const OldBlueprint = await WorkoutBlueprint.findOne({ where: { blueprint_id, user_id }});

    if (!OldBlueprint) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-blueprint-id'
        }
      });
    }

    const OldExercises = await OrderedExercise.findAll({
      include: { model: WorkoutBlueprint, where: { blueprint_id: OldBlueprint.blueprint_id } }
    });

    await OrderedExercise.destroy({ where: { ordered_exercise_id: OldExercises.map(exercise => exercise.exercise_id) } });

    await OldBlueprint.destroy();
    
    return res.status(200).json({
      status: 'success',
      response: {
        message: 'blueprint-deleted',
        blueprint: OldBlueprint
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