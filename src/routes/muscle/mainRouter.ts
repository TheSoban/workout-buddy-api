import express, { Router } from 'express'
import { body } from 'express-validator'
import { userAuthenticated, userMod, userCompleted, userNotDisabled, validParameters } from '../../middleware'
import { Muscle } from '../../database/models'
import { APIUser } from '../../auth/interfaces'

export const mainRouter = Router()

.get("/", userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response) => {
  try {

    const muscles = await Muscle.findAll({});
    
    return res.status(200).json({
      status: 'success',
      response: {
        muscles
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

.get("/:muscle_id", userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response) => {
  try {

    const { muscle_id } = req.params;
  
    const muscle = await Muscle.findByPk(muscle_id);
    
    if (!muscle) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-muscle-id'
        }
      });
    }

    return res.status(200).json({
      status: 'success',
      response: {
        muscle
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
  body('name').trim().isLength({ min: 1, max: 50 }).escape(),
], validParameters, async (req: express.Request, res: express.Response) => {
  try {

    const { user_id } = req.user as APIUser;
    
    const { name } = req.body;

    const newMuscle = await Muscle.create({
      name,
      author_id: user_id
    });
    
    return res.status(200).json({
      status: 'success',
      response: {
        muscle: newMuscle
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

.post("/:muscle_id/update", userAuthenticated, userNotDisabled, userCompleted, userMod, [
  body('name').trim().isLength({ min: 1, max: 50 }).escape(),
], validParameters, async (req: express.Request, res: express.Response) => {
  try {

    const { muscle_id } = req.params;

    const oldMuscle = await Muscle.findByPk(muscle_id);

    if (!oldMuscle) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-muscle-id'
        }
      });
    }

    await oldMuscle.update(req.body);
    
    return res.status(200).json({
      status: 'success',
      response: {
        message: 'muscle-updated',
        muscle: oldMuscle
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

.post("/:muscle_id/delete", userAuthenticated, userNotDisabled, userCompleted, userMod, async (req: express.Request, res: express.Response) => {
  try {

    const { muscle_id } = req.params;

    const oldMuscle = await Muscle.findByPk(muscle_id);

    if (!oldMuscle) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-muscle-id'
        }
      });
    }

    await oldMuscle.destroy();
    
    return res.status(200).json({
      status: 'success',
      response: {
        message: 'muscle-deleted',
        muscle: oldMuscle
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