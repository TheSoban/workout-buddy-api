import express from 'express'

const authRoute = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.user) return next();
  return res.status(400).json({
    status: 'error',
    response: {
      message: 'not-authenticated'
    }
  });
}

export default authRoute;