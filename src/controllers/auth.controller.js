import { QueryTypes } from "sequelize";
import { TOKEN_SECRET } from "../config.js";
import { sequelize } from "../db.js";
import { createAccesToken } from "../libs/jwt.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, password, name, birthday, rol } = req.body;
  const id = uuidv4();

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    await sequelize.query(
      `
      INSERT INTO users (id , name, email, password, birthday, rol, state, fecha_registro , createdAt, updatedAt)
      VALUES (:id , :name, :email, :password, :birthday, :rol, false, NOW(), NOW(), NOW())
      `,
      {
        replacements: {
          id,
          name,
          email,
          password: passwordHash,
          birthday,
          rol,
        },
      }
    );

    const results = await sequelize.query(
      `SELECT * FROM users WHERE email = :email`,
      {
        replacements: { email },
        type: QueryTypes.SELECT,
      }
    );

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado después del registro" });
    }

    const userData = results[0];

    // const token = await createAccesToken({ id: userData.id });

    // res.cookie("token", token);
    const dataUser = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      birthday: userData.birthday,
      rol: userData.rol,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };

    res.status(200).json({
      message: "Usuario registrado correctamente",
      response: dataUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error?.errors[0].message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [userFound] = await sequelize.query(
      `SELECT * FROM users WHERE email = :email`,
      {
        replacements: { email },
        type: QueryTypes.SELECT,
      }
    );
    // const userFound = await User.findOne({ where: { email } });

    if (!userFound)
      return res.status(400).json({ message: "Credenciales invalidas." });

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch)
      return res.status(400).json({ message: "Credenciales invalidas." });

    const token = await createAccesToken({ id: userFound.id });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    const dataUser = {
      id: userFound.id,
      email: userFound.email,
      name: userFound.name,
      fecha_registro: userFound.fecha_registro,
      rol: userFound.rol,
      state: userFound.state,
      birthday: userFound.birthday,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    };

    res.status(200).json({
      message: "User has logged",
      response: dataUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  return res.sendStatus(200);
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    const [userFound] = await sequelize.query(
      `
      SELECT *
      FROM users
      WHERE id = :id
      `,
      {
        replacements: { id: user.id },
        type: QueryTypes.SELECT,
      }
    );
    if (!userFound) return res.status(401).json({ message: "Unauthorized" });

    return res.status(200).json({
      message: "User found",
      response: userFound,
    });
  });
};
