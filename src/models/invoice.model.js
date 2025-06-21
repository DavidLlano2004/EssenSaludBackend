import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

export const Invoice = sequelize.define(
  "invoices",
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

    medicalAppointmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "medical_appointments",
        key: "id",
      },
      onDelete: "RESTRICT", // evita borrar un plan si hay afiliados que lo usan
      onUpdate: "CASCADE",
    },
    cost: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "invoices",
  }
);
