import { supabase } from "../config/supabase.js";

export const Materia = {
  async getMateriasPorAlumno(carrera_id, semestre) {
    const { data, error } = await supabase
      .from('materias') 
      .select('id, nombre_materia, carrera_id, semestre')
      .eq('semestre', semestre)
      .or(`carrera_id.eq.${carrera_id},carrera_id.eq.1`) 
      .order('nombre_materia', { ascending: true }); 

    if (error) throw error;
    return data;
  },

  async getMateriasPorGrupo(id_grupo) {
    const { data, error } = await supabase
      .from('grupo_materias')
      .select(`
        id_materia,
        materias (
          id,
          nombre_materia
        )
      `)
      .eq('id_grupo', id_grupo);

    if (error) throw error;
    return data.map(item => item.materias);
  }
};