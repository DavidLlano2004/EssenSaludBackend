import { QueryTypes } from "sequelize";
import { sequelize } from "../db.js";

export const createHealthyPlan = async (req, res) => {
  const { name, description, month_cost } = req.body;

  try {
    await sequelize.query(
      `
      INSERT INTO healthy_plans (name, description, month_cost, createdAt, updatedAt)
      VALUES (:name , :description , :month_cost , NOW(), NOW())
      `,
      {
        replacements: {
          name,
          description,
          month_cost,
        },
      }
    );

    const results = await sequelize.query(
      `SELECT * FROM healthy_plans WHERE name = :name`,
      {
        replacements: { name },
        type: QueryTypes.SELECT,
      }
    );

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: "Plan no encontrado después del registro" });
    }

    const healthyPlanData = results[0];

    res.status(200).json({
      message: "Plan registrado correctamente",
      response: healthyPlanData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error?.errors[0].message });
  }
};

export const updateHealthyPlan = async (req, res) => {
  const { id } = req.params;
  const { name, description, month_cost } = req.body;

  try {
    // 1. Actualizar usuario
    await sequelize.query(
      `
      UPDATE healthy_plans
      SET name = :name,
          description = :description,
          month_cost = :month_cost,
          updatedAt = NOW()
      WHERE id = :id
      `,
      {
        replacements: {
          name,
          description,
          month_cost,
        },
        type: QueryTypes.UPDATE,
      }
    );

    const [updateHealthyPlan] = await sequelize.query(
      `
      SELECT *
      FROM healthy_plans
      WHERE id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    if (!updateHealthyPlan) {
      return res
        .status(404)
        .json({ message: "Plan no encontrado despues de actualizar" });
    }

    res.status(200).json({
      message: "Plan actualizado correctamente",
      response: updateHealthyPlan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el plan" });
  }
};

export const getOneHealthyPlan = async (req, res) => {
  const { id } = req.params;

  const [healthyCenterPlan] = await sequelize.query(
    `
      SELECT *
      FROM healthy_plans
      WHERE id = :id
      `,
    {
      replacements: { id: id },
      type: QueryTypes.SELECT,
    }
  );
  if (!healthyCenterPlan)
    return res.status(400).json({ message: "Plan no encontrado" });

  return res.status(200).json({
    message: "Plan encontrado",
    response: healthyCenterPlan,
  });
};

export const getHealthyPlans = async (req, res) => {
  try {
    const healthyPlans = await sequelize.query(
      `
      SELECT *
      FROM healthy_plans
      ORDER BY createdAt DESC
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      message: "Planes encontrados",
      response: healthyPlans,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en encontrar planes" });
  }
};

export const deleteHealthyPlan = async (req, res) => {
  const { id } = req.params;

  try {
    // 
    const [result] = await sequelize.query(
      `
      DELETE FROM healthy_plans
      WHERE id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.DELETE,
      }
    );

    // Sequelize no devuelve filas eliminadas, así que verificamos si el usuario existía antes
    return res.status(200).json({
      message: `Plan con ID ${id} eliminado correctamente.`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar el plan" });
  }
};
