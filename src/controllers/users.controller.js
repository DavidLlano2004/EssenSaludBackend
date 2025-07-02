import { User } from "../models/user.model.js";

export const createUser = async (req, res) => {
  try {
    // Cambia birthdate a birthday para ser consistente con el modelo y el resto del backend
    const { name, email, password, rol, birthday } = req.body;
    // El usuario se crea con state: true por defecto
    const user = await User.create({ name, email, password, rol, birthday, state: true });
    res.status(201).json({ message: "Usuario creado correctamente", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear usuario", error });
  }
};