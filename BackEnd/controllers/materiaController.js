
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