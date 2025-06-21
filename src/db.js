// src/db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// export const sequelize = new Sequelize(
//   process.env.DB_NAME, //Nombre base de datos
//   process.env.DB_USER, // Usuario
//   process.env.DB_PASSWORD,
//   {
//     host: "localhost",
//     dialect: "mysql",
//     port: process.env.DB_PORT || 3306, // opcional
//     logging: false,
//   }
// );

export const sequelize = new Sequelize(process.env.DB_URL, {
  // host: "localhost",
  dialect: "mysql",
  // port: process.env.DB_PORT || 3306, // opcional
  logging: false,
});
