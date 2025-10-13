import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Importamos los modelos
import { User, Role } from "../models/index.js"; 
// 👆 Aquí se asume que en tu index.js de modelos exportas todos los modelos de forma centralizada.


// ============================
// 🧾 REGISTRO DE USUARIO
// ============================
export const register = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;
    // Aceptar tanto `rolId` (español) como `roleId` (inglés) en el request
    const rolId = req.body.rolId || req.body.roleId;

    // 🔹 Validamos campos requeridos
    if (!nombre || !correo || !password || !rolId) {
      return res.status(400).json({
        message: "Nombre, correo, contraseña y rol son requeridos"
      });
    }

    // 🔹 Verificamos si ya existe el usuario
    const userExist = await User.findOne({ where: { correo } });
    if (userExist) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // 🔹 Encriptamos la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Creamos el nuevo usuario (usamos la columna/foreign key `rolId`)
    const newUser = await User.create({
      nombre,
      correo,
      password: hashedPassword,
      rolId // asociamos el usuario con un rol existente
    });

    // 🔹 Eliminamos la contraseña del JSON
    const userSafe = newUser.toJSON();
    delete userSafe.password;

  // 🔹 Incluimos el rol asociado
  const role = await Role.findByPk(rolId);
  userSafe.role = role ? role.nombre : null;

    return res.status(201).json({
      message: "Usuario registrado con éxito",
      user: userSafe
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};


// ============================
// 🔐 LOGIN DE USUARIO
// ============================
export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ message: "Correo y contraseña son requeridos" });
    }

    // 🔹 Buscamos al usuario junto con su rol
    const user = await User.findOne({
      where: { correo },
      include: [{ model: Role, as: "role" }]
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // 🔹 Verificamos la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // 🔹 Creamos el token
    const payload = {
      id: user.id,
      correo: user.correo,
      role: user.role.nombre
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // 🔹 Preparamos respuesta sin contraseña
    const userSafe = user.toJSON();
    delete userSafe.password;

    return res.json({
      message: "Inicio de sesión exitoso",
      user: userSafe,
      token
    });

  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};
