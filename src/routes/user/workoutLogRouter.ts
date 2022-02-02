import express, { Router } from 'express'
import { body } from 'express-validator'
import { userAuthenticated, userMod, userCompleted, userNotDisabled, validParameters } from '../../middleware'
import { Exercise, SetLog, WorkoutLog } from '../../database/models'
import { APIUser } from '../../auth/interfaces'

export const workoutLogRouter = Router()

.get("/", userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response) => {
  try {

    const { user_id } = req.user as APIUser;

    const logs = await WorkoutLog.findAll({
      where: { author_id: user_id },
      include: [
        { 
          model: SetLog,
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
        message: 'logs-found',
        logs
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

.get("/:log_id", userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response) => {
  try {

    const { user_id } = req.user as APIUser;

    const { log_id } = req.params;
  
    const log = await WorkoutLog.findOne({
      where: { author_id: user_id, log_id },
      include: [
        { 
          model: SetLog,
          include: [
            {
              model: Exercise
            }
          ]
        },
      ]
    });
    
    if (!log) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-log-id'
        }
      });
    }

    return res.status(200).json({
      status: 'success',
      response: {
        message: 'log-found',
        log
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
  body('date').isDate(),
  body('exercises.*.exercise_id').isInt(),
  body('exercises.*.order').isInt(),
  body('exercises.*.repetitions').isInt(),
  body('exercises.*.value').isInt(),
  body('exercises.*.unit').trim().escape().isIn(['kg', 'lbs']),
], validParameters, async (req: express.Request, res: express.Response) => {
  try {

    const { user_id } = req.user as APIUser;
    
    const { name, date, exercises } = req.body;

    const newLog = await WorkoutLog.create({
      name, 
      date,
      author_id: user_id
    });

    const newSetLogs = await SetLog.bulkCreate(exercises.map((exercise: ({ exercise_id: string, order: number, repetitions: number, value: number, unit: string }), exerciseIdx: number) => ({ 
      order: exercise.order,
      repetitions: exercise.repetitions,
      value: exercise.value,
      unit: exercise.unit,
      log_id: newLog.log_id,
      exercise_id: exercise.exercise_id
    })));

    await newLog.$set('set_logs', newSetLogs);
    
    return res.status(200).json({
      status: 'success',
      response: {
        message: 'log-created',
        log: newLog
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

.post("/:log_id/update", userAuthenticated, userNotDisabled, userCompleted, [
  body('name').optional().isLength({ max: 50 }).trim().escape(),
  body('date').optional().isDate(),
  body('exercises.*.exercise_id').isInt(),
  body('exercises.*.order').isInt(),
  body('exercises.*.repetitions').isInt(),
  body('exercises.*.value').isInt(),
  body('exercises.*.unit').isLength({ min: 1, max: 10}).trim().escape(),
], validParameters, async (req: express.Request, res: express.Response) => {
  try {

    const { log_id } = req.params;

    const { user_id } = req.user as APIUser;
    
    const { exercises } = req.body;

    const OldLog = await WorkoutLog.findOne({ where: { log_id, author_id: user_id }});

    if (!OldLog) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-log-id'
        }
      });
    }

    await OldLog.update(req.body);

    const oldSetLogs = await SetLog.findAll({
      include: { model: WorkoutLog, where: { log_id: OldLog.log_id } }
    });

    await SetLog.destroy({ where: { set_id: oldSetLogs.map(setLog => setLog.set_id) } });

    const newSetLogs = await SetLog.bulkCreate(exercises.map((exercise: ({ exercise_id: string, order: number, repetitions: number, value: number, unit: string }), exerciseIdx: number) => ({ 
      order: exercise.order,
      repetitions: exercise.repetitions,
      value: exercise.value,
      unit: exercise.unit,
      log_id: OldLog.log_id,
      exercise_id: exercise.exercise_id
    })));

    await OldLog.$set('set_logs', newSetLogs);
    
    return res.status(200).json({
      status: 'success',
      response: {
        message: 'log-updated',
        log: OldLog
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

.post("/:log_id/delete", userAuthenticated, userNotDisabled, userCompleted, async (req: express.Request, res: express.Response) => {
  try {

    const { log_id } = req.params;

    const { user_id } = req.user as APIUser;

    const OldLog = await WorkoutLog.findOne({ where: { log_id, author_id: user_id }});

    if (!OldLog) {
      return res.status(400).json({
        status: 'error',
        response: {
          message: 'invalid-log-id'
        }
      });
    }

    const oldSetLogs = await SetLog.findAll({
      include: { model: WorkoutLog, where: { log_id: OldLog.log_id } }
    });

    await SetLog.destroy({ where: { set_id: oldSetLogs.map(setLog => setLog.set_id) } });

    await OldLog.destroy();
    
    return res.status(200).json({
      status: 'success',
      response: {
        message: 'log-deleted',
        log: OldLog
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