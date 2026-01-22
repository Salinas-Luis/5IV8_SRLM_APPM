import express from "express";
import { obtenerMateriasPorGrupo } from "../controllers/materiaController.js";

const router = express.Router();

router.get("/mis-materias", obtenerMateriasPorGrupo);

export default router;