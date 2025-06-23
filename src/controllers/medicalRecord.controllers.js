import { QueryTypes } from "sequelize";
import { sequelize } from "../db.js";
import { v4 as uuidv4 } from "uuid";

export const createMedicalRecord = async (req, res) => {
  const { medicalAppointmentId, symptoms, diagnostic, treatment } = req.body;
  const id = uuidv4();

  try {
    await sequelize.query(
      `
      INSERT INTO medical_records (id ,medicalAppointmentId, symptoms, diagnostic, treatment,  createdAt, updatedAt)
      VALUES (:id , :medicalAppointmentId , :symptoms , :diagnostic , :treatment , NOW(), NOW())
      `,
      {
        replacements: {
          id ,
          medicalAppointmentId,
          symptoms,
          diagnostic,
          treatment,
        },
      }
    );

    const results = await sequelize.query(
      `SELECT * FROM medical_records WHERE medicalAppointmentId = :medicalAppointmentId`,
      {
        replacements: { medicalAppointmentId },
        type: QueryTypes.SELECT,
      }
    );

    if (!results || results.length === 0) {
      return res.status(404).json({
        message: "Historia clínica no encontrada después del registro",
      });
    }

    const medicalRecord = results[0];

    res.status(200).json({
      message: "Historia clínica registrada correctamente",
      response: medicalRecord,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error?.errors[0].message });
  }
};

export const updateMedicalRecord = async (req, res) => {
  const { id } = req.params;
  const { medicalAppointmentId, symptoms, diagnostic, treatment } = req.body;

  try {
    // 1. Actualizar usuario
    await sequelize.query(
      `
      UPDATE medical_records
      SET medicalAppointmentId = :medicalAppointmentId,
          symptoms = :symptoms,
          diagnostic = :diagnostic,
          treatment = :treatment,
          updatedAt = NOW()
      WHERE id = :id
      `,
      {
        replacements: {
          medicalAppointmentId,
          symptoms,
          diagnostic,
          treatment,
        },
        type: QueryTypes.UPDATE,
      }
    );

    const [updateMedicalRecord] = await sequelize.query(
      `
      SELECT *
      FROM medical_records
      WHERE id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    if (!updateMedicalRecord) {
      return res.status(404).json({
        message: "Historia clínica no encontrado despues de actualizar",
      });
    }

    res.status(200).json({
      message: "Historia clínica actualizada correctamente",
      response: updateMedicalRecord,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al actualizar la Historia clínica" });
  }
};

export const getOneMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const [medicalRecord] = await sequelize.query(
      `
        SELECT *
        FROM medical_records
        WHERE id = :id
        `,
      {
        replacements: { id: id },
        type: QueryTypes.SELECT,
      }
    );
    if (!medicalRecord)
      return res
        .status(400)
        .json({ message: "Historia clínica no encontrada" });

    return res.status(200).json({
      message: "Historia clínica encontrada",
      response: medicalRecord,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al traer la historia clínica", error: error });
  }
};

export const getMedicalRecord = async (req, res) => {
  try {
    const medicalRecord = await sequelize.query(
      `
      SELECT *
      FROM medical_records
      ORDER BY createdAt DESC
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      message: "Historia clínica encontradas",
      response: medicalRecord,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error en encontrar Historia clínica" });
  }
};

export const deleteMedicalAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    //
    const [result] = await sequelize.query(
      `
      DELETE FROM medical_records
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

export const getFrequentDiagnoses = async (req, res) => {
  try {
    const [results] = await sequelize.query(
      `SELECT p.specialty, ch.diagnosis, COUNT(*) AS count
       FROM clinical_histories ch
       JOIN medical_appointments ma ON ch.appointmentId = ma.id
       JOIN professionals p ON ma.professionalId = p.userId
       GROUP BY p.specialty, ch.diagnosis
       ORDER BY count DESC`
    );
    return res.status(200).json({
      message: "Diagnosticos frecuentes encontrados",
      response: results,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
