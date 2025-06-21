import { QueryTypes } from "sequelize";
import { sequelize } from "../db.js";

export const createHealthyCenter = async (req, res) => {
  const { name, address, phone, city } = req.body;

  try {
    await sequelize.query(
      `
      INSERT INTO healthy_centers (name, address, phone, city, createdAt, updatedAt)
      VALUES (:name , :address , :phone , :birthday , :city , NOW(), NOW())
      `,
      {
        replacements: {
          name,
          address,
          phone,
          city,
        },
      }
    );

    const results = await sequelize.query(
      `SELECT * FROM healthy_centers WHERE name = :name`,
      {
        replacements: { name },
        type: QueryTypes.SELECT,
      }
    );

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: "Centro no encontrado después del registro" });
    }

    const healthyCenterData = results[0];

    res.status(200).json({
      message: "Centro registrado correctamente",
      response: healthyCenterData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error?.errors[0].message });
  }
};

export const updateHealthyCenter = async (req, res) => {
  const { id } = req.params;
  const { name, address, phone, city } = req.body;

  try {
    // 1. Actualizar usuario
    await sequelize.query(
      `
      UPDATE healthy_centers
      SET name = :name,
          address = :address,
          birthday = :birthday,
          phone = :phone,
          city = :city,
          updatedAt = NOW()
      WHERE id = :id
      `,
      {
        replacements: {
          name,
          address,
          phone,
          city,
          updatedAt,
        },
        type: QueryTypes.UPDATE,
      }
    );

    const [updateHealthyCenter] = await sequelize.query(
      `
      SELECT *
      FROM healthy_centers
      WHERE id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    if (!updateHealthyCenter) {
      return res
        .status(404)
        .json({ message: "Centro no encontrado despues de actualizar" });
    }

    res.status(200).json({
      message: "Centro actualizado correctamente",
      response: updateHealthyCenter,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el centro" });
  }
};

export const getOneHealthyCenter = async (req, res) => {
  const { id } = req.params;

  const [healthyCenterFound] = await sequelize.query(
    `
      SELECT *
      FROM healthy_centers
      WHERE id = :id
      `,
    {
      replacements: { id: id },
      type: QueryTypes.SELECT,
    }
  );
  if (!healthyCenterFound)
    return res.status(400).json({ message: "Centro no encontrado" });

  return res.status(200).json({
    message: "Centro encontrado",
    response: healthyCenterFound,
  });
};

export const getHealthyCenters = async (req, res) => {
  try {
    const healthyCenters = await sequelize.query(
      `
      SELECT *
      FROM healthy_centers
      ORDER BY createdAt DESC
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      message: "Centros encontrados",
      response: healthyCenters,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en encontrar centros" });
  }
};

export const deleteHealthyCenter = async (req, res) => {
  const { id } = req.params;

  try {
    // 
    const [result] = await sequelize.query(
      `
      DELETE FROM healthy_centers
      WHERE id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.DELETE,
      }
    );

    // Sequelize no devuelve filas eliminadas, así que verificamos si el usuario existía antes
    return res.status(200).json({
      message: `Centro con ID ${id} eliminado correctamente.`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar el centro" });
  }
};

export const getTopCenters = async (req, res) => {
  try {
    const [results] = await sequelize.query(
      `SELECT hc.name, COUNT(*) AS total
       FROM medical_appointments ma
       JOIN healthy_centers hc ON ma.healthyCenterId = hc.id
       GROUP BY hc.name
       ORDER BY total DESC`
    );
   return res.status(200).json({
      message: "Centros mas utilizados para citas",
      response: results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
