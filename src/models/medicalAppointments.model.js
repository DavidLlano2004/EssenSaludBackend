import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const MedicalAppointment = sequelize.define(
  "medical_appointments",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Genera algo como 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
      primaryKey: true,
    },
    affiliateId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "affiliates",
        key: "userId",
      },
    },
    professionalId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "professionals",
        key: "userId",
      },
    },
    healthyCenterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "healthy_centers",
        key: "id",
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    state: {
      type: DataTypes.ENUM("programada", "realizada", "cancelada"),
      allowNull: false,
    },
  },
  {
    tableName: "medical_appointments",
  }
);
