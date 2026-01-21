import { Auth } from "../models/authModel.js";
import { User } from "../models/userModel.js";

export const registrarUsuario = async (req, res) => {
  const { nombre_completo, email, username, password, carrera_id, grupo_id, semestre,  rol } = req.body;

  if (!nombre_completo || !email || !username || !password || !carrera_id || !grupo_id || !semestre) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "El formato del correo no es válido." });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres." });
  }

  try {
    const correoId = await Auth.createEmail(email);
    
    const contrasenaId = await Auth.createPassword(password);
    
    const usernameId = await Auth.createUsername(username);

    const nuevoUsuario = await User.createFullRegistration(nombre_completo, {
      correo_id: correoId,
      contrasena_id: contrasenaId,
      username_id: usernameId,
      carrera_id: carrera_id,
      grupo_id: grupo_id,
      semestre: semestre
    }, rol);

    return res.status(201).json({
      message: "Usuario registrado con éxito",
      data: nuevoUsuario
    });

  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: "El correo o nombre de usuario ya existe." });
    }
    return res.status(500).json({ error: "Error interno del servidor: " + error.message });
  }
};

export const loginUsuario = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña son obligatorios" });
    }

    try {
        const usuario = await Auth.login(email, password);
        return res.status(200).json({
            message: "Bienvenido",
            user: {
                id: usuario.nombre_id,
                nombre: usuario.nombre_completo,
                rol: usuario.rol,
                carrera_id: usuario.carrera_id, 
                semestre: usuario.semestre,    
                grupo_id: usuario.grupo_id    
            }
        });
    } catch (error) {
        console.error("DETALLE TÉCNICO:", error);
        return res.status(401).json({ error: error.message });
    }
};

export const actualizarNotificaciones = async (req, res) => {
  const { userId, frecuencia } = req.body;

  const opcionesValidas = ['diario', 'semanal', 'solo_urgentes', 'ninguna'];
  if (!opcionesValidas.includes(frecuencia)) {
    return res.status(400).json({ error: "Frecuencia no válida." });
  }

  try {
    const usuarioActualizado = await User.updateNotificationPreference(userId, frecuencia);
    res.status(200).json({
      message: "Preferencia de notificación actualizada",
      data: usuarioActualizado
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editarPerfil = async (req, res) => {
  const { userId, nombre_completo, frecuencia_notificaciones } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "El ID del usuario es obligatorio para actualizar." });
  }

  if (nombre_completo !== undefined) {
    if (typeof nombre_completo !== 'string' || nombre_completo.trim().length < 3) {
      return res.status(400).json({ error: "El nombre debe ser un texto de al menos 3 caracteres." });
    }
    req.body.nombre_completo = nombre_completo.trim();
  }

  if (frecuencia_notificaciones !== undefined) {
    const opcionesValidas = ['diario', 'semanal', 'solo_urgentes', 'ninguna'];
    if (!opcionesValidas.includes(frecuencia_notificaciones)) {
      return res.status(400).json({ 
        error: `Frecuencia no válida. Opciones: ${opcionesValidas.join(', ')}` 
      });
    }
  }

  try {
    const perfilActualizado = await User.updateProfile(userId, {
      nombre_completo: req.body.nombre_completo,
      frecuencia_notificaciones: frecuencia_notificaciones
    });

    res.status(200).json({
      message: "Perfil actualizado correctamente",
      user: perfilActualizado
    });

  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el perfil: " + error.message });
  }
};
export const obtenerCompaneros = async (req, res) => {
  const { grupo_id } = req.params;

  if (!grupo_id || isNaN(grupo_id)) {
    return res.status(400).json({ error: "El ID del grupo no es válido." });
  }

  try {
    const companeros = await User.getCompaneros(grupo_id);

    if (companeros.length === 0) {
      return res.status(404).json({ message: "No se encontraron compañeros en este grupo." });
    }

    res.status(200).json(companeros);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener compañeros: " + error.message });
  }
};
