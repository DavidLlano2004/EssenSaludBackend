// src/db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  "proyecto_web", //Nombre base de datos
  "proyecto_web", // Usuario
  "admin1234",
  {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
  }
);

// export const sequelize = new Sequelize(process.env.DB_URL, {
//   // host: "localhost",
//   dialect: "mysql",
//   // port: process.env.DB_PORT || 3306, // opcional
//   logging: false,
// });
