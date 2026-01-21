import express from "express";
import { obtenerMateriasUsuario } from "../controllers/materiaController.js";

const router = express.Router();

router.get("/mis-materias", obtenerMateriasUsuario);

export default router;