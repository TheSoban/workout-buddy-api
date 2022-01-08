import express from 'express'
import { validationResult, ValidationError } from 'express-validator'

const formatter = ({ msg, param }: ValidationError) => ({ [param]: msg });

const validParameters = (req: express.Request, res: express.Response, next: express.NextFunction) => {

  const errors = validationResult(req);

    if (errors.isEmpty()) return next();

    return res.status(400).json({
      status: 'error',
      response: {
        message: 'invalid-parameters',
        errors: errors.formatWith(formatter).array()
      }
    });


}

export default validParameters;