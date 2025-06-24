import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Affiliates = sequelize.define(
  "affiliates",
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true, //  Clave primaria
      references: {
        model: "users", //  FK a users.id
        key: "id",
      },
      allowNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    document_type: {
      type: DataTypes.STRING,
      allowNull: false, // Esto valida que no sea NULL en la base de datos
    },
    document_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    healthyPlanId: {
      type: DataTypes.UUID,
      references: {
        model: "healthy_plans",
        key: "id",
      },
      allowNull: true,
      onDelete: "RESTRICT", // evita borrar un plan si hay afiliados que lo usan
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "affiliates",
  }
);
