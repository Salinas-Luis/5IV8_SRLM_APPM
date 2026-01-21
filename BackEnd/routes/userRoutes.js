import express from "express";
import { registrarUsuario, loginUsuario, actualizarNotificaciones, obtenerCompaneros } from "../controllers/userController.js";

const router = express.Router();

router.post("/registrar", registrarUsuario);

router.post("/login", loginUsuario);

router.put("/configurar-notificaciones", actualizarNotificaciones);

router.get("/companeros/:grupo_id", obtenerCompaneros);

export default router;