import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const MedicalRecord = sequelize.define(
  "medical_records",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Genera algo como 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
      primaryKey: true,
    },
    medicalAppointmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "medical_appointments",
        key: "id",
      },
    },
    symptoms: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    diagnostic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    treatment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "medical_records",
  }
);
