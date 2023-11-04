import express from "express";
const router = express.Router();

import { registrarAdministrador,
loginAdministrador,
confirmarAdministrador } from "../controllers/administradorController.js";

// Autenticación, Registro y Confirmación de Administradores
router.post("/", registrarAdministrador);   // Crear un nuevo administrador
router.post("/login", loginAdministrador);  // Autenticar administrador
router.get("/confirmar/:tokenAdmin", confirmarAdministrador);  // Confirmar la cuenta de administrador

export default router;
