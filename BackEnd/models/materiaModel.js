import { supabase } from "../config/supabaseClient.js";

export const Materia = {
  async getMateriasPorAlumno(carrera_id, semestre) {
    try {
      const { data, error } = await supabase
        .from('materias') 
        .select('id, nombre_mate, carrera_id, semestre')
        .or(`carrera_id.eq.${carrera_id},carrera_id.eq.1`)
        .eq('semestre', semestre)
        .order('nombre_mate', { ascending: true }); 

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error en MateriaModel:", error.message);
      throw error;
    }
  }
};