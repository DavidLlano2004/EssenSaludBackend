import { QueryTypes } from "sequelize";
import { sequelize } from "../db.js";
import { v4 as uuidv4 } from "uuid";
const id = uuidv4();

export const createMedicalAppointMent = async (req, res) => {
  const { affiliateId, professionalId, healthyCenterId, date_time, state } =
    req.body;

  try {
    await sequelize.query(
      `
      INSERT INTO medical_appointments (id , affiliateId, professionalId, healthyCenterId, date_time ,state,  createdAt, updatedAt)
      VALUES (:id , :affiliateId , :professionalId , :healthyCenterId , :date_time ,:state, NOW(), NOW())
      `,
      {
        replacements: {
          id,
          affiliateId,
          professionalId,
          healthyCenterId,
          date_time,
          state,
        },
      }
    );

    const results = await sequelize.query(
      `SELECT * FROM medical_appointments WHERE affiliateId = :affiliateId`,
      {
        replacements: { affiliateId },
        type: QueryTypes.SELECT,
      }
    );

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: "Cita médica no encontrada después del registro" });
    }

    const medicalAppointmentData = results[0];

    res.status(200).json({
      message: "Cita médica registrada correctamente",
      response: medicalAppointmentData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error?.errors[0].message });
  }
};

export const updateMedicalAppointment = async (req, res) => {
  const { id } = req.params;
  const { affiliateId, professionalId, healthyCenterId, date_time, state } =
    req.body;

  try {
    // 1. Actualizar usuario
    await sequelize.query(
      `
      UPDATE medical_appointments
      SET affiliateId = :affiliateId,
          medicalAppointmentId = :medicalAppointmentId,
          cost = :cost,
          payment_status = :payment_status,
          updatedAt = NOW()
      WHERE id = :id
      `,
      {
        replacements: {
          affiliateId,
          professionalId,
          healthyCenterId,
          date_time,
          state,
          updatedAt,
        },
        type: QueryTypes.UPDATE,
      }
    );

    const [updateMedicalAppointment] = await sequelize.query(
      `
      SELECT *
      FROM medical_appointments
      WHERE id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    if (!updateMedicalAppointment) {
      return res
        .status(404)
        .json({ message: "Cita médica no encontrado despues de actualizar" });
    }

    res.status(200).json({
      message: "Cita médica actualizada correctamente",
      response: updateMedicalAppointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la Cita médica" });
  }
};

export const getOneMedicalAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const [medicalAppointment] = await sequelize.query(
      `
      SELECT *
      FROM medical_appointments
      WHERE id = :id
      `,
      {
        replacements: { id: id },
        type: QueryTypes.SELECT,
      }
    );
    if (!medicalAppointment)
      return res.status(400).json({ message: "Cita médica no encontrada" });

    return res.status(200).json({
      message: "Cita médica encontrada",
      response: medicalAppointment,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al traer la Cita médica", error: error });
  }
};

export const getMedicalAppointments = async (req, res) => {
  try {
    const medicalAppointments = await sequelize.query(
      `
      SELECT *
      FROM medical_appointments
      ORDER BY createdAt DESC
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      message: "Citas médicas encontradas",
      response: medicalAppointments,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error en encontrar Citas médicas" });
  }
};

export const deleteMedicalAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    //
    const [result] = await sequelize.query(
      `
      DELETE FROM medical_appointments
      WHERE id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.DELETE,
      }
    );

    // Sequelize no devuelve filas eliminadas, así que verificamos si el usuario existía antes
    return res.status(200).json({
      message: `Cita médica con ID ${id} eliminado correctamente.`,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error al eliminar el Cita médica" });
  }
};
