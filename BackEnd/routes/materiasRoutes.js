import express from "express";
import { obtenerMateriasPorGrupo, obtenerMisMaterias, obtenerTareasProfesor, eliminarTarea, editarTarea } from "../controllers/materiaController.js";

const router = express.Router();

router.get("/por-grupo", obtenerMateriasPorGrupo);

router.get("/mis-materias", obtenerMisMaterias);

router.get('/tareas-profesor', obtenerTareasProfesor);

router.delete('/tarea/:id', eliminarTarea);

router.put('/tarea/:id', editarTarea);
export default router;