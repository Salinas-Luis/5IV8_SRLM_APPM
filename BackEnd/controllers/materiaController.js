import { Materia } from "../models/materiaModel.js";

export const obtenerMateriasUsuario = async (req, res) => {
  const carrera_id = parseInt(req.query.carrera_id);
  const semestre = parseInt(req.query.semestre);

  if (isNaN(carrera_id) || isNaN(semestre)) {
    return res.status(400).json({ 
      error: "Datos inválidos. carrera_id y semestre deben ser números." 
    });
  }

  if (semestre < 1 || semestre > 6) {
    return res.status(400).json({ error: "El semestre debe estar entre 1 y 6." });
  }

  if (carrera_id < 1 || carrera_id > 4) {
    return res.status(400).json({ error: "ID de carrera no válido (1-4)." });
  }

  try {
    const materias = await Materia.getMateriasPorAlumno(carrera_id, semestre);
    if (!materias || materias.length === 0) {
      return res.status(404).json({ 
        message: "No se encontraron materias para tu carrera y semestre actual." 
      });
    }

    res.status(200).json(materias);
  } catch (error) {
    res.status(500).json({ error: "Error de servidor al cargar materias." });
  }
};