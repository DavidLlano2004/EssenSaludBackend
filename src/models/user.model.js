// src/models/user.model.js
import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../db.js";

export const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Genera algo como 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Esto valida que no sea NULL en la base de datos
      validate: {
        notEmpty: true, // No permitir cadenas vacías ""
        is: /^[^\s].*[^\s]$/, // Valida que no tenga solo espacios (regex opcional)
      },
      set(value) {
        // Elimina espacios al inicio y final
        this.setDataValue("name", value.trim());
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM("Afiliado", "Profesional", "Administrativo"),
      allowNull: false,
    },
    birthday: { type: DataTypes.DATEONLY, allowNull: false },
    state: { type: DataTypes.BOOLEAN, allowNull: false },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "users", // opcional, Sequelize por defecto lo hace plural
  }
);
