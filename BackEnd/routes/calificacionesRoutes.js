import express from "express";
import { registrarCalificacion } from "../controllers/calificacionController.js";

const router = express.Router();

router.post("/registrar", registrarCalificacion);

export default router;