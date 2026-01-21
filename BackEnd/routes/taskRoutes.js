import express from "express";
import { crearTarea, obtenerTareasPorAlumno, verSeguimientoTarea, entregarTarea, calificarTarea } from "../controllers/taskController.js";

const router = express.Router();

router.post("/crear", crearTarea);

router.get("/grupo/:grupo_id", obtenerTareasPorAlumno);

router.get("/seguimiento/:tareaId", verSeguimientoTarea);

router.post("/entregar", entregarTarea);

router.get("/ver-entregas/:tarea_id", async (req, res) => {
    try {
        const entregas = await Grade.getDeliveriesByTask(req.params.tarea_id);
        res.json(entregas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/calificar", calificarTarea);
export default router;