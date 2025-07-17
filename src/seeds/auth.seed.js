import { sequelize } from "../db.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export const seedInitUserAdmin = async () => {
  try {
    const [results] = await sequelize.query(
      `SELECT COUNT(*) AS count FROM users`
    );

    if (results[0].count === 0) {
      const passwordHash = await bcrypt.hash("admin1234", 10);

      await sequelize.query(
        `
        INSERT INTO users 
          (id, name, gender, email, password, rol, birthday, state, fecha_registro, createdAt, updatedAt) 
        VALUES 
          (:id1 , 'Admin', 'Masculino', 'admin@gmail.com', :password, 'Administrativo', '2004-01-17', true, NOW(), NOW(), NOW());
      `,
        {
          replacements: {
            id1: uuidv4(),
            password: passwordHash,
          },
        }
      );
      console.log("Usuario administrador creado");
    }
  } catch (error) {
    console.error("Error al inicializar el usuario admin:", error);
  }
};
