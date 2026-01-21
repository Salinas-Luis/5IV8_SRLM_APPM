import { supabase } from "../config/supabaseClient.js";

export const Calificacion = {
  async registrarNota(datos) {
    const { data, error } = await supabase
      .from('calificaciones')
      .insert([{
        usuario_id: datos.usuario_id,
        materia_id: datos.materia_id,
        calificacion: datos.calificacion,
        parcial: datos.parcial
      }])
      .select();

    if (error) throw error;
    return data[0];
  },

  async getCalificacionesPorAlumno(usuario_id) {
    const { data, error } = await supabase
      .from('calificaciones')
      .select(`
        id_calificacion,
        calificacion,
        parcial,
        materias (
          nombre_mate
        )
      `)
      .eq('usuario_id', usuario_id)
      .order('parcial', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getPromedioMateria(usuario_id, materia_id) {
    const { data, error } = await supabase
      .from('calificaciones')
      .select('calificacion')
      .eq('usuario_id', usuario_id)
      .eq('materia_id', materia_id);

    if (error) throw error;
    
    if (data.length === 0) return 0;
    const suma = data.reduce((acc, curr) => acc + parseFloat(curr.calificacion), 0);
    return (suma / data.length).toFixed(2);
  }
};