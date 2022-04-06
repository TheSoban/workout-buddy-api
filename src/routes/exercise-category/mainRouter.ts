import express, { Router } from 'express'
import { body } from 'express-validator'
import { userAuthenticated, userMod, userCompleted, userNotDisabled, validParameters } from '../../middleware'
import { ExerciseCategory } from '../../database/models'
import { APIUser } from '../../auth/interfaces'

export const mainRouter = Router()

.get("/", userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response) => {
  try {

    const categories = await ExerciseCategory.findAll({});
    
    return res.status(200).json({
      status: 'success',
      response: {
        message: 'categories-found',
        categories
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

.get("/:category_id", userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response) => {
  try {

    const { category_id } = req.params;
  
    const category = await ExerciseCategory.findByPk(category_id);
    
    if (!category) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-category-id'
        }
      });
    }

    return res.status(200).json({
      status: 'success',
      response: {
        message: 'category-found',
        category
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

    const newCategory = await ExerciseCategory.create({
      name,
      author_id: user_id
    });
    
    return res.status(200).json({
      status: 'success',
      response: {
        message: 'category-created',
        category: newCategory
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

.post("/:category_id/update", userAuthenticated, userNotDisabled, userCompleted, userMod, [
  body('name').optional().trim().isLength({ min: 1, max: 50 }).escape(),
], validParameters, async (req: express.Request, res: express.Response) => {
  try {

    const { category_id } = req.params;

    const oldCategory = await ExerciseCategory.findByPk(category_id);

    if (!oldCategory) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-category-id'
        }
      });
    }

    await oldCategory.update(req.body);
    
    return res.status(200).json({
      status: 'success',
      response: {
        message: 'category-updated',
        category: oldCategory
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

.post("/:category_id/delete", userAuthenticated, userNotDisabled, userCompleted, userMod, async (req: express.Request, res: express.Response) => {
  try {

    const { category_id } = req.params;

    const oldCategory = await ExerciseCategory.findByPk(category_id, {
      attributes: ['category_id', 'name']
    });

    if (!oldCategory) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-category-id'
        }
      });
    }

    await oldCategory.destroy();
    
    return res.status(200).json({
      status: 'success',
      response: {
        message: 'category-deleted',
        category: oldCategory
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