import express from 'express'

const unauthRoute = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.user) return next();
  return res.status(400).json({
    status: 'error',
    response: {
      message: 'already-authenticated'
    }
  });
}

export default unauthRoute;