import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const HealthyPlan = sequelize.define(
  "healthy_plans",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Genera algo como 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    month_cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    tableName: "healthy_plans",
  }
);
