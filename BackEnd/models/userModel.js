import { supabase } from "../config/supabase.js";
export const User = {
  async createFullRegistration(nombre_completo, ids, rol = 'alumno') {
    const { data, error } = await supabase
      .from('registro')
      .insert([{
        nombre_completo: nombre_completo,
        correo_id: ids.correo_id,
        contrasena_id: ids.contrasena_id,
        username_id: ids.username_id,
        carrera_id: ids.carrera_id,
        grupo_id: ids.grupo_id, 
        semestre: ids.semestre, 
        rol: rol 
      }])
      .select(`
        nombre_id,
        nombre_completo,
        rol,
        correo:correo_id (email)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async updateNotificationPreference(userId, frecuencia) {
    const { data, error } = await supabase
      .from('registro')
      .update({ frecuencia_notificaciones: frecuencia })
      .eq('nombre_id', userId)
      .select('nombre_id, frecuencia_notificaciones')
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId, updates) {
    const { data: usuario, error: errUser } = await supabase
        .from('registro')
        .select('correo_id')
        .eq('nombre_id', userId)
        .single();

    if (errUser) throw errUser;

    if (updates.email) {
        const { error: errEmail } = await supabase
            .from('correo') 
            .update({ email: updates.email })
            .eq('correo_id', usuario.correo_id);

        if (errEmail) throw errEmail;
    }
    const { data, error } = await supabase
        .from('registro')
        .update({ nombre_completo: updates.nombre_completo })
        .eq('nombre_id', userId)
        .select(`
            nombre_id, 
            nombre_completo, 
            rol,
            correo:correo_id (email)
        `)
        .single();

    if (error) throw error;
    return data;
} ,

  async getCompaneros(grupo_id) {
    const { data, error } = await supabase
      .from('registro')
      .select(`
          nombre_id,
          nombre_completo,
          rol,
          correo:correo_id (email)
      `)
      .eq('grupo_id', grupo_id)
      .eq('rol', 'alumno'); 

    if (error) throw error;
    return data;
  }
};