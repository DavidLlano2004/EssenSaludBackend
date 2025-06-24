import { sequelize } from "../db.js";
import { v4 as uuidv4 } from "uuid";

export const seedInitHealthPlans = async () => {
  try {
    const [results] = await sequelize.query(
      `SELECT COUNT(*) AS count FROM healthy_plans`
    );

    if (results[0].count === 0) {
      await sequelize.query(
        `
        INSERT INTO healthy_plans (id , name, description, month_cost, createdAt, updatedAt) VALUES
        (:id1 , 'Plan Básico', 'Cobertura esencial para consultas generales y servicios básicos de salud', 100000, NOW(), NOW()),
        (:id2 , 'Plan Estándar', 'Cobertura completa para usuarios que necesitan atención más frecuente, con acceso a especialistas y exámenes más avanzados.', 180000, NOW(), NOW()),
        (:id3 , 'Plan Premium', 'Atención médica integral con acceso preferencial, cobertura nacional, hospitalización y más beneficios exclusivos.', 240000, NOW(), NOW());
      `,
        {
          replacements: {
            id1: uuidv4(),
            id2: uuidv4(),
            id3: uuidv4(),
          },
        }
      );
    }
  } catch (error) {
    console.error("Error al inicializar los planes de salud:", error);
  }
};
