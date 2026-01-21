import { supabase } from "../config/supabase.js";

export const Auth = {
  async createEmail(email) {
    const { data, error } = await supabase
      .from('correo')
      .insert([{ email }])
      .select('id')
      .single();

    if (error) {
      if (error.code === '23505') throw new Error("El correo ya está registrado.");
      throw error;
    }
    return data.id;
  },

  async createPassword(password) {
    const { data, error } = await supabase
      .from('contrasena')
      .insert([{ contrasena:password }])
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  },

  async createUsername(username) {
    const { data, error } = await supabase
      .from('nombre_usuario')
      .insert([{ username }])
      .select('nombreu_id')
      .single();

    if (error) {
      if (error.code === '23505') throw new Error("El nombre de usuario ya existe.");
      throw error;
    }
    return data.nombreu_id;
  },
async login(email, password) {
    const { data: correoData, error: correoError } = await supabase
      .from('correo')
      .select('id')
      .eq('email', email)
      .single();

    if (correoError || !correoData) throw new Error("Correo no encontrado");
    const { data: usuario, error: userError } = await supabase
      .from('registro')
      .select(`
        nombre_id,
        nombre_completo,
        rol,
        semestre,
        grupo_id,
        carrera_id,
        contrasena:contrasena_id (contrasena) 
      `)
      .eq('correo_id', correoData.id)
      .single();

    if (userError || !usuario) {
        console.error("Error de Supabase:", userError);
        throw new Error("Error al obtener datos del usuario");
    }

    if (usuario.contrasena.contrasena !== password) {
      throw new Error("Contraseña incorrecta");
    }

    const { contrasena, ...usuarioLimpio } = usuario;
    return usuarioLimpio;
  }
};