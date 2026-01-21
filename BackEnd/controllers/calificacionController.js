import { Calificacion } from "../models/calificacionModel.js";

export const registrarCalificacion = async (req, res) => {
    const { usuario_id, materia_id, calificacion, parcial } = req.body;

    if (!usuario_id || !materia_id || calificacion === undefined || !parcial) {
        return res.status(400).json({ error: "Faltan datos obligatorios (usuario, materia, nota o parcial)." });
    }

    if (calificacion < 0 || calificacion > 10) {
        return res.status(400).json({ error: "La calificación debe estar entre 0 y 10." });
    }

    if (![1, 2, 3].includes(parseInt(parcial))) {
        return res.status(400).json({ error: "El parcial debe ser 1, 2 o 3." });
    }

    try {
        const nuevaNota = await Calificacion.registrarNota({
            usuario_id,
            materia_id,
            calificacion,
            parcial
        });

        res.status(201).json({ message: "Calificación registrada con éxito", data: nuevaNota });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar en la base de datos: " + error.message });
    }
};