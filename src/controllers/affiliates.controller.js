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

export const getUpcomingAppointmentsAffiliate = async (req, res) => {
  const { id } = req.params;
  try {
    const results = await sequelize.query(
      `SELECT 
  m.*,
  JSON_OBJECT(
    'userId', a.userId,
    'document_number', a.document_number,
    'address', a.address,
    'phone', a.phone,
    'user', JSON_OBJECT(
      'name', ua.name,
      'email', ua.email,
      'gender', ua.gender,
      'birthday', ua.birthday
    ),
    'healthyPlan', JSON_OBJECT(
      'id', ha.id,
      'name', ha.name,
      'month_cost', ha.month_cost
    )
  ) AS infoAffiliate,

  JSON_OBJECT(
    'userId', p.userId,
    'specialty', p.specialty,
    'license_number', p.license_number,
    'user', JSON_OBJECT(
      'name', up.name,
      'email', up.email
    )
  ) AS infoProfessional,

  JSON_OBJECT(
    'id', h.id,
    'name', h.name,
    'address', h.address,
    'phone', h.phone,
    'city', h.city
  ) AS infoHealthyCenter

FROM 
  medical_appointments m

-- Afiliado y sus joins
LEFT JOIN affiliates a ON m.affiliateId = a.userId
LEFT JOIN users ua ON a.userId = ua.id
LEFT JOIN healthy_plans ha ON a.healthyPlanId = ha.id

-- Profesional y su usuario
LEFT JOIN professionals p ON m.professionalId = p.userId
LEFT JOIN users up ON p.userId = up.id

-- Centro de salud
LEFT JOIN healthy_centers h ON m.healthyCenterId = h.id

-- Filtro por afiliado y fechas
WHERE 
  m.affiliateId = :id
  AND m.date BETWEEN NOW() AND NOW() + INTERVAL 3 DAY
  AND m.state = 'programada'

ORDER BY 
  m.createdAt DESC;
`,
      { replacements: { id }, type: QueryTypes.SELECT }
    );
    return res.status(200).json({
      message: "Citas próximas en los siguientes 3 días encontradas",
      response: results,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
