import { supabase } from "../config/supabase.js";

export const Materia = {
  async getMateriasPorAlumno(carrera_id, semestre) {
    try {
      const { data, error } = await supabase
        .from('materias') 
        .select('id, nombre_materia, carrera_id, semestre')
        .eq('semestre', semestre)
        .or(`carrera_id.eq.${carrera_id},carrera_id.eq.1`)
        .order('nombre_materia', { ascending: true }); 

      if (error) {
        console.error("Error en Supabase:", error.message);
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Error en MateriaModel:", error.message);
      throw error;
    }
  }
};