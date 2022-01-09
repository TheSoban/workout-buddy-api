import express, { Router } from 'express'
import { body } from 'express-validator'
import { userAuthenticated, validParameters, userCompleted, userNotDisabled } from '../../middleware'
import { BodyMeasurement } from '../../database/models'
import { APIUser } from '../../auth/interfaces'

export const bodyMeasurementRouter = Router()

.get("/", userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response) => {
  try {
    
    const { user_id } = req.user as APIUser;

    const measurements = await BodyMeasurement.findAll({
      where: { user_id },
      attributes: ['measurement_id', 'weight', 'water_percentage', 'body_fat', 'visceral_fat',
        'muscle', 'bone_mass', 'createdAt'
      ]
    });

    return res.status(200).json({
      status: 'success',
      response: {
        message: 'body-measurements-found',
        measurements
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

.get("/:measurement_id", userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response) => {
  try {

    const { measurement_id } = req.params;
    
    const { user_id } = req.user as APIUser;

    const measurement = await BodyMeasurement.findOne({
      where: {
        measurement_id,
        user_id
      },
      attributes: ['measurement_id', 'weight', 'water_percentage', 'body_fat', 'visceral_fat',
        'muscle', 'bone_mass', 'createdAt'
      ]
    });

    if (!measurement) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-measurement-id'
        }
      });
    }

    return res.status(200).json({
      status: 'success',
      response: {
        message: 'body-measurement-found',
        measurement
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

.post('/', userAuthenticated, userNotDisabled, userCompleted, [
  body('weight').isDecimal(),
  body('water_percentage').optional().isDecimal(),
  body('body_fat').optional().isDecimal(),
  body('visceral_fat').optional().isInt(),
  body('muscle').optional().isDecimal(),
  body('bone_mass').optional().isDecimal()
], validParameters, async (req: express.Request, res: express.Response, next: any) => {
  try {

    const { user_id } = req.user as APIUser;
    
    const { weight, water_percentage, body_fat, visceral_fat, muscle, bone_mass } = req.body;

    const newMeasurement = await BodyMeasurement.create({
      weight, 
      water_percentage, 
      body_fat, 
      visceral_fat,
      muscle, 
      bone_mass,
      user_id
    });

    return res.status(200).json({
      status: 'success',
      response: {
        message: 'body-measurement-created',
        measurement: {
          weight: newMeasurement.weight, 
          water_percentage: newMeasurement.water_percentage, 
          body_fat: newMeasurement.body_fat, 
          visceral_fat: newMeasurement.visceral_fat,
          muscle: newMeasurement.muscle, 
          bone_mass: newMeasurement.bone_mass
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

.post('/:measurement_id/update', userAuthenticated, userNotDisabled, userCompleted, [
  body('weight').optional().isDecimal(),
  body('water_percentage').optional().isDecimal(),
  body('body_fat').optional().isDecimal(),
  body('visceral_fat').optional().isInt(),
  body('muscle').optional().isDecimal(),
  body('bone_mass').optional().isDecimal()
], validParameters, async (req: express.Request, res: express.Response, next: any) => {
  try {

    const { measurement_id } = req.params;

    const { user_id } = req.user as APIUser;

    const oldMeasurement = await BodyMeasurement.findOne({
      where: {
        measurement_id,
        user_id
      },
      attributes: ['measurement_id', 'weight', 'water_percentage', 'body_fat', 'visceral_fat',
        'muscle', 'bone_mass'
      ]
    });

    if (!oldMeasurement) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-measurement-id'
        }
      });
    }

    await oldMeasurement.update(req.body);

    return res.status(200).json({
      status: 'success',
      response: {
        message: 'body-measurement-updated',
        measurement: oldMeasurement
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

.post('/:measurement_id/delete', userAuthenticated, userNotDisabled, userCompleted, [
  body('weight').optional().isDecimal(),
  body('water_percentage').optional().isDecimal(),
  body('body_fat').optional().isDecimal(),
  body('visceral_fat').optional().isInt(),
  body('muscle').optional().isDecimal(),
  body('bone_mass').optional().isDecimal()
], validParameters, async (req: express.Request, res: express.Response, next: any) => {
  try {

    const { measurement_id } = req.params;

    const { user_id } = req.user as APIUser;

    const oldMeasurement = await BodyMeasurement.findOne({
      where: {
        measurement_id,
        user_id
      },
      attributes: ['measurement_id', 'weight', 'water_percentage', 'body_fat', 'visceral_fat',
        'muscle', 'bone_mass'
      ]
    });

    if (!oldMeasurement) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-measurement-id'
        }
      });
    }

    await oldMeasurement.destroy();

    return res.status(200).json({
      status: 'success',
      response: {
        message: 'body-measurement-deleted',
        measurement: oldMeasurement
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