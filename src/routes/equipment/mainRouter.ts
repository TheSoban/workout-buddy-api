import express, { Router } from 'express'
import { body } from 'express-validator'
import { userAuthenticated, userMod, userCompleted, userNotDisabled, validParameters } from '../../middleware'
import { Equipment } from '../../database/models'
import { APIUser } from '../../auth/interfaces'

export const mainRouter = Router()

.get("/", userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response) => {
  try {

    const equipment = await Equipment.findAll({});
    
    return res.status(200).json({
      status: 'success',
      response: {
        message: 'equipment-found',
        equipment
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

.get("/:equipment_id", userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response) => {
  try {

    const { equipment_id } = req.params;
  
    const equipment = await Equipment.findByPk(equipment_id);
    
    if (!equipment) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-equipment-id'
        }
      });
    }

    return res.status(200).json({
      status: 'success',
      response: {
        message: 'equipment-found',
        equipment
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

    const newEquipment = await Equipment.create({
      name,
      author_id: user_id
    });
    
    return res.status(200).json({
      status: 'success',
      response: {
        message: 'equipment-created',
        equipment: newEquipment
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

.post("/:equipment_id/update", userAuthenticated, userNotDisabled, userCompleted, userMod, [
  body('name').optional().trim().isLength({ min: 1, max: 50 }).escape(),
], validParameters, async (req: express.Request, res: express.Response) => {
  try {

    const { equipment_id } = req.params;

    const oldEquipment = await Equipment.findByPk(equipment_id);

    if (!oldEquipment) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-equipment-id'
        }
      });
    }

    await oldEquipment.update(req.body);
    
    return res.status(200).json({
      status: 'success',
      response: {
        message: 'equipment-updated',
        equipment: oldEquipment
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

.post("/:equipment_id/delete", userAuthenticated, userNotDisabled, userCompleted, userMod, async (req: express.Request, res: express.Response) => {
  try {

    const { equipment_id } = req.params;

    const oldEquipment = await Equipment.findByPk(equipment_id);

    if (!oldEquipment) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-equipment-id'
        }
      });
    }

    await oldEquipment.destroy();
    
    return res.status(200).json({
      status: 'success',
      response: {
        message: 'equipment-deleted',
        equipment: oldEquipment
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