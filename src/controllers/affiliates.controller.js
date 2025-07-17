import { QueryTypes } from "sequelize";
import { sequelize } from "../db.js";
import { Affiliates } from "../models/affiliates.model.js";

export const createAffiliate = async (req, res) => {
  const {
    userId,
    document_type,
    document_number,
    address,
    phone,
    healthyPlanId,
  } = req.body;

  try {
    await sequelize.query(
      `
      INSERT INTO affiliates (userId, document_type, document_number, address, phone, healthyPlanId , createdAt, updatedAt)
      VALUES (:userId , :document_type , :document_number , :address, :phone , :healthyPlanId , NOW(), NOW())
      `,
      {
        replacements: {
          userId,
          document_type,
          document_number,
          address,
          phone,
          healthyPlanId,
        },
      }
    );

    const results = await sequelize.query(
      `SELECT * FROM affiliates WHERE userId = :userId`,
      {
        replacements: { userId },
        type: QueryTypes.SELECT,
      }
    );

    if (!results || results?.length === 0) {
      return res
        .status(404)
        .json({ message: "Afiliado no encontrado después del registro" });
    }

    const affiliateData = results[0];

    res.status(200).json({
      message: "Afiliado registrado correctamente",
      response: affiliateData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};

export const updateAffiliate = async (req, res) => {
  const { id } = req.params;
  const fieldsToUpdate = req.body;

  try {
    const [updatedCount] = await Affiliates.update(fieldsToUpdate, {
      where: { userId: id },
    });

    if (updatedCount === 0) {
      return res
        .status(404)
        .json({ message: "Afiliado no encontrado o sin cambios" });
    }

    const updatedAffiliate = await Affiliates.findOne({
      where: { userId: id },
    });

    res.status(200).json({
      message: "Afiliado actualizado correctamente",
      response: updatedAffiliate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al actualizar el afiliado",
      error: error.message || error,
    });
  }
};

export const getOneAffiliate = async (req, res) => {
  const { id } = req.params;

  const [affiliateFound] = await sequelize.query(
    `
    SELECT a.*,
    JSON_OBJECT(
    'id', h.id,
    'name', h.name,
    'description', h.description,
    'month_cost', h.month_cost
    ) AS infoHealthyPlan
     FROM 
     affiliates a 
     LEFT JOIN 
     healthy_plans h ON a.healthyPlanId = h.id
     WHERE 
     a.userId = :id;
      `,
    {
      replacements: { id: id },
      type: QueryTypes.SELECT,
    }
  );
  if (!affiliateFound)
    return res.status(400).json({ message: "Afiliado no encontrado" });

  return res.status(200).json({
    message: "Afiliado encontrado",
    response: affiliateFound,
  });
};

export const getAffiliates = async (req, res) => {
  try {
    const affiliates = await sequelize.query(
      `
      SELECT 
      a.*, 
      u.*
      FROM 
      affiliates a
      LEFT JOIN 
      users u ON a.userId = u.id
      ORDER BY a.createdAt DESC
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      message: "Afiliados encontrados",
      response: affiliates,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

export const deleteAffiliate = async (req, res) => {
  const { id } = req.params;

  try {
    //
    const [result] = await sequelize.query(
      `
      DELETE FROM affiliates
      WHERE userId = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.DELETE,
      }
    );

    // Sequelize no devuelve filas eliminadas, así que verificamos si el usuario existía antes
    return res.status(200).json({
      message: `Afiliado con ID ${id} eliminado correctamente.`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};

export const getUpcomingAppointments = async (req, res) => {
  const { id } = req.params;
  try {
    const results = await sequelize.query(
      `SELECT * FROM medical_appointments 
       WHERE affiliateId = :id 
         AND date_time > NOW() 
         AND state = 'programada'`,
      { replacements: { id }, type: QueryTypes.SELECT }
    );
    return res.status(200).json({
      message: "Citas proximas encontradas",
      response: results,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
