import dotenv from 'dotenv'
import express, { Router } from 'express'
import { body } from 'express-validator'
import { userAuthenticated, validParameters, userCompleted, userNotDisabled } from '../../middleware'
import { BodyMeasurement } from '../../database/models'
import { APIUser } from '../../auth/interfaces'

dotenv.config();

export const bodyMeasurementRouter = Router()

.get("/", userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response) => {
  const { user_id } = req.user as APIUser;

  const measurements = await BodyMeasurement.findAll({
    where: {
      user_id
    }
  });

  res.status(200).json({
    status: 'success',
    response: {
      message: 'body-measurements-found',
      data: measurements
    }
  });
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

    const newBodyMeasurement = await BodyMeasurement.create({
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
        data: newBodyMeasurement
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      response: {
        message: 'server-fail'
      }
    });
  }
});