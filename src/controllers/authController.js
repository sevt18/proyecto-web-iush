// controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';
import AuditLog from '../models/AuditLog.js'; // ajusta la ruta si tu archivo tiene otro nombre/ubicación

/**
 * Registrar usuario con rol 'visitante'
 */
export const registerUser = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    // Validaciones básicas
    if (!nombre || !correo || !password) {
      return res.status(400).json({ message: 'nombre, correo y password son requeridos' });
    }

    if (typeof correo !== 'string' || !correo.includes('@')) {
      return res.status(400).json({ message: 'El correo no es válido' });
    }

    // Verificar usuario existente
    const existingUser = await User.findOne({ where: { correo } });
    if (existingUser) {
      return res.status(409).json({ message: 'El correo ya está en uso' });
    }

    // Buscar role 'visitante'
    const role = await Role.findOne({ where: { nombre: 'visitante' } });
    if (!role) {
      return res.status(500).json({ message: "Rol 'visitante' no encontrado. Crea roles en la BD" });
    }

    // Validaciones de contraseña
    if (typeof password !== 'string' || password.trim().length === 0) {
      return res.status(400).json({ message: 'La contraseña es requerida' });
    }

    if (password.trim().length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ message: 'La contraseña debe contener al menos una letra mayúscula' });
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ message: 'La contraseña debe contener al menos un número' });
    }

    if (!/[!@#$%^&*]/.test(password)) {
      return res.status(400).json({ message: 'La contraseña debe contener al menos un carácter especial (!@#$%^&*)' });
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await User.create({
      nombre,
      correo,
      password: hashedPassword,
      rolId: role.id
    });

    // Registrar en AuditLog (si existe el modelo)
    try {
      if (AuditLog && typeof AuditLog.create === 'function') {
        await AuditLog.create({
          accion: 'REGISTRO_USUARIO',
          fechaHora: new Date(),
          descripcion: `Usuario ${newUser.id} registrado con rol visitante`,
          usuarioId: newUser.id
        });
      }
    } catch (auditError) {
      console.warn('No se pudo crear audit log (registerUser):', auditError.message);
      // no interrumpimos el flujo por un fallo en el log
    }

    // Preparar respuesta sin password
    const userSafe = newUser.toJSON ? newUser.toJSON() : { ...newUser };
    delete userSafe.password;

    return res.status(201).json({ message: 'Usuario registrado con éxito', user: userSafe });
  } catch (error) {
    console.error('registerUser error:', error);
    return res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

/**
 * Registrar distribuidor con rol 'distribuidor'
 */
export const registerDistributor = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    // Validaciones básicas
    if (!nombre || !correo || !password) {
      return res.status(400).json({ message: 'nombre, correo y password son requeridos' });
    }

    if (typeof correo !== 'string' || !correo.includes('@')) {
      return res.status(400).json({ message: 'El correo no es válido' });
    }

    // Verificar correo existente
    const existingUser = await User.findOne({ where: { correo } });
    if (existingUser) {
      return res.status(409).json({ message: 'El correo ya está en uso' });
    }

    // Buscar role 'distribuidor'
    const role = await Role.findOne({ where: { nombre: 'distribuidor' } });
    if (!role) {
      return res.status(500).json({ message: "Rol 'distribuidor' no encontrado. Crea roles en la BD" });
    }

    // Validaciones de contraseña (mismas reglas que usuario)
    if (typeof password !== 'string' || password.trim().length === 0) {
      return res.status(400).json({ message: 'La contraseña es requerida' });
    }

    if (password.trim().length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ message: 'La contraseña debe contener al menos una letra mayúscula' });
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ message: 'La contraseña debe contener al menos un número' });
    }

    if (!/[!@#$%^&*]/.test(password)) {
      return res.status(400).json({ message: 'La contraseña debe contener al menos un carácter especial (!@#$%^&*)' });
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear distribuidor
    const newUser = await User.create({
      nombre,
      correo,
      password: hashedPassword,
      rolId: role.id
    });

    // Registrar en AuditLog (si existe)
    try {
      if (AuditLog && typeof AuditLog.create === 'function') {
        await AuditLog.create({
          accion: 'REGISTRO_DISTRIBUIDOR',
          fechaHora: new Date(),
          descripcion: `Distribuidor ${newUser.id} registrado`,
          usuarioId: newUser.id
        });
      }
    } catch (auditError) {
      console.warn('No se pudo crear audit log (registerDistributor):', auditError.message);
    }

    // Preparar respuesta sin password
    const userSafe = newUser.toJSON ? newUser.toJSON() : { ...newUser };
    delete userSafe.password;

    return res.status(201).json({ message: 'Distribuidor creado', user: userSafe });
  } catch (error) {
    console.error('registerDistributor error:', error);
    return res.status(500).json({ message: 'Error registering distributor', error: error.message });
  }
};

/**
 * Login para usuarios (visitante, distribuidor, admin)
 */
export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Validaciones básicas
    if (!correo || !password) {
      return res.status(400).json({ message: 'correo y password son requeridos' });
    }

    // Buscar usuario por correo e incluir role (as: 'role' según tu association)
    const user = await User.findOne({
      where: { correo },
      include: [{ model: Role, as: 'role' }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Comparar contraseña
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Preparar payload para el token: id y nombre del role (si existe)
    const roleName = user.role ? user.role.nombre : null;
    const payload = { id: user.id, role: roleName };

    // Firmar JWT (usa JWT_SECRET en .env; si no existe, secreta de desarrollo)
    const token = jwt.sign(payload, process.env.JWT_SECRET , { expiresIn: '2h' });

    // Registrar en AuditLog (intentar pero no fallar si hay error)
    try {
      if (AuditLog && typeof AuditLog.create === 'function') {
        await AuditLog.create({
          accion: 'LOGIN',
          fechaHora: new Date(),
          descripcion: `Login exitoso usuario ${user.id} (${roleName})`,
          usuarioId: user.id
        });
      }
    } catch (auditError) {
      console.warn('No se pudo crear audit log (login):', auditError.message);
    }

    // Preparar user seguro para respuesta (sin password)
    const userSafe = user.toJSON ? user.toJSON() : { ...user };
    delete userSafe.password;

    return res.json({
      message: 'Autenticado',
      token,
      user: userSafe
    });
  } catch (error) {
    console.error('login error:', error);
    return res.status(500).json({ message: 'Error en login', error: error.message });
  }
};
