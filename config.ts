import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();
// Replace 'your_db_name', 'your_db_user', and 'your_db_password' with your actual PostgreSQL database credentials

export const sequelize = new Sequelize(process.env.DB_URI as string, {
  dialect: 'postgres',
  logging: false
});

