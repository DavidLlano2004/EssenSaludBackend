import { QueryTypes } from "sequelize";
import { sequelize } from "../db.js";

export const createProfessional = async (req, res) => {
  const { userId, specialty, license_number, centerId } = req.body;

  try {
    await sequelize.query(
      `
      INSERT INTO professionals (userId, specialty, license_number, centerId, createdAt, updatedAt)
      VALUES (:userId , :specialty , :license_number , :centerId , NOW(), NOW())
      `,
      {
        replacements: {
          userId,
          specialty,
          license_number,
          centerId,
        },
      }
    );

    const results = await sequelize.query(
      `SELECT * FROM professionals WHERE userId = :userId`,
      {
        replacements: { userId },
        type: QueryTypes.SELECT,
      }
    );

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: "Profesional no encontrado después del registro" });
    }

    const professionalData = results[0];

    res.status(200).json({
      message: "Profesional registrado correctamente",
      response: professionalData,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: message });
  }
};

export const updateProfessional = async (req, res) => {
  const { id } = req.params;
  const { userId, specialty, license_number, centerId } = req.body;

  try {
    // 1. Actualizar usuario
    await sequelize.query(
      `
      UPDATE professionals
      SET userId = :userId,
          document_number = :document_number,
          specialty = :specialty,
          license_number = :license_number,
          centerId = :centerId,
          updatedAt = NOW()
      WHERE userId = :id
      `,
      {
        replacements: {
          userId,
          specialty,
          license_number,
          centerId,
        },
        type: QueryTypes.UPDATE,
      }
    );

    const [updateProfessionalEnd] = await sequelize.query(
      `
      SELECT *
      FROM professionals
      WHERE userId = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    if (!updateProfessionalEnd) {
      return res
        .status(404)
        .json({ message: "Profesional no encontrado despues de actualizar" });
    }

    res.status(200).json({
      message: "Profesional actualizado correctamente",
      response: updateProfessionalEnd,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el Profesional" });
  }
};

export const getOneProfessional = async (req, res) => {
  const { id } = req.params;

  const [professional] = await sequelize.query(
    `
      SELECT *
      FROM professionals
      WHERE userId = :id
      `,
    {
      replacements: { id: id },
      type: QueryTypes.SELECT,
    }
  );
  if (!professional)
    return res.status(400).json({ message: "Profesional no encontrado" });

  return res.status(200).json({
    message: "Profesional encontrado",
    response: professional,
  });
};

export const getProfessionals = async (req, res) => {
  try {
    const professionals = await sequelize.query(
      `
      SELECT *
      FROM professionals
      ORDER BY createdAt DESC
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      message: "Profesionales encontrados",
      response: professionals,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener profesionales" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    //
    const [result] = await sequelize.query(
      `
      DELETE FROM professionals
      WHERE userId = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.DELETE,
      }
    );

    // Sequelize no devuelve filas eliminadas, así que verificamos si el usuario existía antes
    return res.status(200).json({
      message: `Profesional con ID ${id} eliminado correctamente.`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar el profesional" });
  }
};