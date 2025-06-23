import { QueryTypes } from "sequelize";
import { sequelize } from "../db.js";

export const getOneProfile = async (req, res) => {
  const [userFound] = await sequelize.query(
    `
      SELECT id , email, name , birthday, rol , createdAt, updatedAt
      FROM users
      WHERE id = :id
      `,
    {
      replacements: { id: req.user.id },
      type: QueryTypes.SELECT,
    }
  );
  if (!userFound) return res.status(400).json({ message: "User not found" });

  return res.status(200).json({
    message: "User found",
    response: userFound,
  });
};

export const getProfiles = async (req, res) => {
  try {
    const users = await sequelize.query(
      `
      SELECT id, email, name , birthday, rol, state, createdAt, updatedAt
      FROM users
      ORDER BY createdAt DESC
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      message: "Usuarios encontrados",
      response: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

export const updateProfile = async (req, res) => {
  const { id } = req.params; // ID del usuario a editar
  const { name, email, birthday, rol, state } = req.body;

  try {
    // 1. Actualizar usuario
    await sequelize.query(
      `
      UPDATE users
      SET name = :name,
          email = :email,
          birthday = :birthday,
          rol = :rol,
          state = :state,
          updatedAt = NOW()
      WHERE id = :id
      `,
      {
        replacements: {
          id,
          name,
          email,
          birthday,
          rol,
          state,
        },
        type: QueryTypes.UPDATE,
      }
    );

    // 2. Obtener el usuario actualizado
    const [updatedUser] = await sequelize.query(
      `
      SELECT id, email, name , birthday, rol, state, createdAt, updatedAt
      FROM users
      WHERE id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      message: "Usuario actualizado correctamente",
      response: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al actualizar el usuario", error: error });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await sequelize.query(
      `
      DELETE FROM users
      WHERE id = :id
      `,
      {
        replacements: { id },
        type: QueryTypes.DELETE,
      }
    );

    // Sequelize no devuelve filas eliminadas, así que verificamos si el usuario existía antes
    return res.status(200).json({
      message: `Usuario con ID ${id} eliminado correctamente.`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};
