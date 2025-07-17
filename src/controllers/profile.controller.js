import { QueryTypes } from "sequelize";
import { sequelize } from "../db.js";
import { User } from "../models/user.model.js";

export const getOneProfile = async (req, res) => {
  const [userFound] = await sequelize.query(
    `
      SELECT *
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
      SELECT *
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
  const { id } = req.params;
  const dataToUpdate = req.body; // puede tener solo 1 campo o todos

  try {
    const [updatedCount] = await User.update(dataToUpdate, {
      where: { id },
    });

    if (updatedCount === 0) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado o sin cambios" });
    }

    const updatedUser = await User.findOne({
      where: { id },
      attributes: [
        "id",
        "email",
        "name",
        "birthday",
        "gender",
        "rol",
        "state",
        "createdAt",
        "updatedAt",
      ],
    });

    res.status(200).json({
      message: "Usuario actualizado correctamente",
      response: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el usuario", error });
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
