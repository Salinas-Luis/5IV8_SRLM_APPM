import { supabase } from "../config/supabase.js";

export const Task = {
  async create(titulo, descripcion, materia_id, grupo_id, fecha_entrega, profesor_id) {
    const { data, error } = await supabase
      .from('tareas')
      .insert([{
        titulo,
        descripcion,
        materia_id,
        grupo_id, 
        fecha_entrega,
        creada_por: profesor_id
      }])
      .select();

    if (error) throw error;
    return data[0];
  },

  async getByGrupo(grupo_id) {
    const { data, error } = await supabase
      .from('tareas')
      .select(`
        id,
        titulo,
        descripcion,
        fecha_entrega,
        materia:materia_id (nombre_materia),
        profesor:creada_por (nombre_completo)
      `)
      .eq('grupo_id', grupo_id); 

    if (error) throw error;
    return data;
  }
};

export const TaskTracking = {
  async markAsViewed(tareaId, alumnoId) {
    const { data, error } = await supabase
      .from('vistas_tareas')
      .upsert([{ tarea_id: tareaId, alumno_id: alumnoId }], { onConflict: 'tarea_id, alumno_id' });

    if (error) throw error;
    return data;
  },
  async getViewedBy(tareaId) {
    const { data, error } = await supabase
      .from('vistas_tareas')
      .select(`
        fecha_vista,
        alumno:alumno_id (nombre_completo, rol)
      `)
      .eq('tarea_id', tareaId);

    if (error) throw error;
    return data;
  }
};
export const Delivery = {
  async submit(tarea_id, alumno_id, contenido) {
    const { data, error } = await supabase
      .from('entregas')
      .insert([{
        tarea_id,
        alumno_id,
        contenido_entrega: contenido
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const Grade = {
  async getDeliveriesByTask(tarea_id) {
    const { data, error } = await supabase
      .from('entregas')
      .select(`
        id,
        contenido_entrega,
        fecha_envio,
        calificacion,
        comentarios_profesor,
        alumno:alumno_id (nombre_completo)
      `)
      .eq('tarea_id', tarea_id);

    if (error) throw error;
    return data;
  },

  async updateGrade(entrega_id, calificacion, comentarios) {
    const { data, error } = await supabase
      .from('entregas')
      .update({ 
        calificacion, 
        comentarios_profesor: comentarios 
      })
      .eq('id', entrega_id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};