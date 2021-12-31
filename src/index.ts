import express from 'express'
import dotenv from 'dotenv'

import { sequelize } from './database'

dotenv.config();

(async () => {

  await sequelize.sync({ force: true });

  const app = express();

  app.get('/', (req, res) => res.status(200).json({
    status: 'success',
    details: {
      message: 'api-running'
    }
  }));
  
  app.listen(process.env.PORT, () => console.log('Workout Buddy API Started'));
})();