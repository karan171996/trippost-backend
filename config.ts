import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();
// Replace 'your_db_name', 'your_db_user', and 'your_db_password' with your actual PostgreSQL database credentials
console.log('node_env', process.env.NODE_ENV)

  // Option 3: Passing parameters separately (other dialects)
  export const sequelize = process.env.NODE_ENV === 'development' ? new Sequelize(process.env.DB_DATABASE as string, process.env.DB_USER as string, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres'
  }) : new Sequelize(process.env.DB_URI as string, {
  dialect: 'postgres',
  logging: true
});

