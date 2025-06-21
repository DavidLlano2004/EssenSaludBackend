import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Professional = sequelize.define(
  "Professional",
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true, //  Clave primaria
      references: {
        model: "users", //  FK a users.id
        key: "id",
      },
      onDelete: "CASCADE",
      allowNull: false,
    },
    specialty: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    license_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    centerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "healthy_centers",
        key: "id",
      },
    },
  },
  {
    tableName: "professionals",
  }
);
