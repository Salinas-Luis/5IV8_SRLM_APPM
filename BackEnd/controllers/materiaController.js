import { supabase } from "../config/supabase.js";
import { Materia } from "../models/materiaModel.js";

export const obtenerMateriasPorGrupo = async (req, res) => {
    try {
        const { id_grupo } = req.query;
        if (!id_grupo) return res.status(400).json({ error: "ID de grupo requerido" });

        const materias = await Materia.getMateriasPorGrupo(id_grupo);
        
        console.log(`Materias encontradas para grupo ${id_grupo}:`, materias.length);
        res.json(materias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
export const obtenerMisMaterias = async (req, res) => {
    const { usuario_id } = req.query;

    try {
        const { data: usuario, error: errU } = await supabase
            .from('registro')
            .select('carrera_id, semestre')
            .eq('nombre_id', usuario_id)
            .single();

        if (errU || !usuario) throw new Error("Alumno no encontrado");
        const { data: materias, error: errM } = await supabase
            .from('materias')
            .select(`
                id, 
                nombre_materia,
                calificaciones!left (
                    calificacion,
                    parcial,
                    usuario_id
                )
            `)
            .eq('semestre', usuario.semestre)
            .or(`carrera_id.eq.1,carrera_id.eq.${usuario.carrera_id}`);

        if (errM) throw errM;

        const respuesta = materias.map(m => {
            const notasAlumno = m.calificaciones?.filter(c => c.usuario_id == usuario_id) || [];
            
            return {
                nombre_materia: m.nombre_materia,
                p1: notasAlumno.find(n => n.parcial === 1)?.calificacion || "0.0",
                p2: notasAlumno.find(n => n.parcial === 2)?.calificacion || "0.0",
                p3: notasAlumno.find(n => n.parcial === 3)?.calificacion || "0.0"
            };
        });

        res.json(respuesta);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const obtenerTareasProfesor = async (req, res) => {
    const { autor_id } = req.query;
    try {
        const { data, error } = await supabase
            .from('tareas')
            .select('*')
            .eq('autor_id', autor_id)
            .order('id', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarTarea = async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('tareas').delete().eq('id', id);
        if (error) throw error;
        res.json({ message: "Tarea eliminada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const editarTarea = async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, fecha_entrega } = req.body;
    try {
        const { error } = await supabase
            .from('tareas')
            .update({ titulo, descripcion, fecha_entrega })
            .eq('id', id);
        if (error) throw error;
        res.json({ message: "Tarea actualizada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};