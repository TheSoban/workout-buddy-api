import Sequelize from 'sequelize'
import express, { Router } from 'express'
import { body } from 'express-validator'
import { userAuthenticated, userMod, userCompleted, userNotDisabled, validParameters } from '../../middleware'
import { Exercise } from '../../database/models'
import { APIUser } from '../../auth/interfaces'

export const mainRouter = Router()

.get("/", userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response) => {
  try {

    const { Op } = Sequelize;

    const filter = req.query.filter || "";

    const exercises = await Exercise.findAll({
      where: { name: { [Op.like]: `%${filter}%` } },
      attributes: ['exercise_id', 'name', 'description', 'version']
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
  
    const exercise = await Exercise.findByPk(exercise_id, {
      attributes: ['exercise_id', 'name', 'description', 'version']
    });
    
    if (!exercise) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-exercise-id'
        }
      });
    }

    return res.status(200).json({
      status: 'success',
      response: {
        exercise
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

.post("/", userAuthenticated, userNotDisabled, userCompleted, userMod, [
  body('name').isLength({ max: 50 }).trim().escape(),
  body('description').isLength({ max: 50 }).trim().escape(),
  body('version').isInt(),
], validParameters, async (req: express.Request, res: express.Response) => {
  try {

    const { user_id } = req.user as APIUser;
    
    const { name, description, version } = req.body;

    const newExercise = await Exercise.create({
      name, 
      description, 
      version,
      author_id: user_id
    });
    
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
], validParameters, async (req: express.Request, res: express.Response) => {
  try {

    const { exercise_id } = req.params;

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