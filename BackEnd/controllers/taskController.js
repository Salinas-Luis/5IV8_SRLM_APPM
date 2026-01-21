import { Task } from "../models/taskModel.js";

export const crearTarea = async (req, res) => {
  const { titulo, descripcion, materia_id, grupo_id, fecha_entrega, profesor_id, rol } = req.body;

  if (rol !== 'profesor') {
    return res.status(403).json({ error: "Permisos insuficientes. Solo los profesores pueden crear tareas." });
  }

  if (!titulo || !materia_id || !grupo_id || !fecha_entrega || !profesor_id) {
    return res.status(400).json({ error: "Faltan campos obligatorios: título, materia, grupo, fecha de entrega y ID del profesor." });
  }

  if (titulo.trim().length < 5) {
    return res.status(400).json({ error: "El título de la tarea es demasiado corto (mínimo 5 caracteres)." });
  }

  const fechaActual = new Date();
  const fechaLimite = new Date(fecha_entrega);
  if (isNaN(fechaLimite.getTime()) || fechaLimite < fechaActual) {
    return res.status(400).json({ error: "La fecha de entrega debe ser válida y posterior a la fecha actual." });
  }

  if (isNaN(materia_id) || isNaN(grupo_id) || isNaN(profesor_id)) {
    return res.status(400).json({ error: "Los identificadores de materia, grupo y profesor deben ser numéricos." });
  }

  try {
    const nuevaTarea = await Task.create(
      titulo.trim(), 
      descripcion ? descripcion.trim() : "", 
      materia_id, 
      grupo_id, 
      fecha_entrega, 
      profesor_id
    );

    res.status(201).json({
      message: "Tarea publicada exitosamente para el grupo.",
      tarea: nuevaTarea
    });

  } catch (error) {
    res.status(500).json({ error: "Error al guardar la tarea: " + error.message });
  }
};

export const obtenerTareasPorAlumno = async (req, res) => {
  const { grupo_id } = req.params; 

  try {
    const tareas = await Task.getByGrupo(grupo_id);
    res.status(200).json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verSeguimientoTarea = async (req, res) => {
  const { tareaId } = req.params;
  const { rol } = req.query; 

  if (rol !== 'profesor') {
    return res.status(403).json({ error: "Solo profesores pueden ver el seguimiento." });
  }

  try {
    const alumnosQueVieron = await TaskTracking.getViewedBy(tareaId);
    res.status(200).json({
      total_vistas: alumnosQueVieron.length,
      alumnos: alumnosQueVieron
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const entregarTarea = async (req, res) => {
  const { tarea_id, alumno_id, contenido, rol } = req.body;

  if (rol !== 'alumno') {
    return res.status(403).json({ error: "Solo los alumnos pueden entregar tareas." });
  }

  if (!tarea_id || !alumno_id || !contenido) {
    return res.status(400).json({ error: "Faltan datos: ID de tarea, alumno o contenido." });
  }

  if (contenido.trim().length < 10) {
    return res.status(400).json({ error: "La entrega es demasiado corta. Por favor, añade más detalle o el link solicitado." });
  }

  try {
    const nuevaEntrega = await Delivery.submit(tarea_id, alumno_id, contenido.trim());
    res.status(201).json({
      message: "Tarea entregada correctamente.",
      data: nuevaEntrega
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: "Ya has enviado una entrega para esta tarea anteriormente." });
    }
    res.status(500).json({ error: "Error al procesar la entrega: " + error.message });
  }
};

export const calificarTarea = async (req, res) => {
  const { entrega_id, calificacion, comentarios, rol } = req.body;

  if (rol !== 'profesor') {
    return res.status(403).json({ error: "No tienes permiso para calificar." });
  }

  if (calificacion === undefined || isNaN(calificacion) || calificacion < 0 || calificacion > 10) {
    return res.status(400).json({ error: "La calificación debe ser un número entre 0 y 10." });
  }

  try {
    const entregaCalificada = await Grade.updateGrade(entrega_id, calificacion, comentarios);
    res.status(200).json({
      message: "Calificación asignada con éxito",
      data: entregaCalificada
    });
  } catch (error) {
    res.status(500).json({ error: "Error al calificar: " + error.message });
  }
};