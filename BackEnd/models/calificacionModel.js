import { supabase } from "../config/supabase.js";

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
  },
  async getMateriasConNotas(usuario_id, carrera_id, semestre) {
    const { data: materias, error: errM } = await supabase
      .from('materias')
      .select('id, nombre_materia, carrera_id')
      .eq('semestre', semestre)
      .or(`carrera_id.eq.1,carrera_id.eq.${carrera_id}`);

    if (errM) throw errM;

    const { data: notas, error: errN } = await supabase
      .from('calificaciones')
      .select('materia_id, calificacion, parcial')
      .eq('usuario_id', usuario_id);

    if (errN) throw errN;

    return materias.map(m => {
      const notasMateria = notas.filter(n => n.materia_id === m.id);
      return {
        id: m.id,
        nombre_materia: m.nombre_materia,
        carrera_id: m.carrera_id,
        p1: notasMateria.find(n => n.parcial === 1)?.calificacion || "0.0",
        p2: notasMateria.find(n => n.parcial === 2)?.calificacion || "0.0",
        p3: notasMateria.find(n => n.parcial === 3)?.calificacion || "0.0"
      };
    });
  }
};