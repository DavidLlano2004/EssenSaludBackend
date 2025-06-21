// src/db.js
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "proyecto_web", //Nombre base de datos
  "proyecto_web", // Usuario
  "admin1234",
  {
    host: "localhost",
    dialect: "mysql",
  }
);
