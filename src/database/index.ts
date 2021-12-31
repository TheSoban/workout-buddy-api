import dotenv from 'dotenv'
import { Sequelize } from 'sequelize-typescript'
import { 
  User, GithubUser
} from './models'

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    models: [
      User, GithubUser
    ]
  }
);

export { sequelize }