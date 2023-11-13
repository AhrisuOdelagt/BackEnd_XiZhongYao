import express from "express";
import checkAuthAdmin from "../middleware/checkAuthAdmin.js";
const router = express.Router();

import { registrarAdministrador,
loginAdministrador,
confirmarAdministrador,
olvidePassword,
comprobarToken,
nuevoPassword,
perfil } from "../controllers/administradorController.js";

// Autenticación, Registro y Confirmación de Administradores
router.post("/", registrarAdministrador);   // Crear un nuevo administrador
router.post("/login", loginAdministrador);  // Autenticar administrador
router.get("/confirmar/:tokenAdmin", confirmarAdministrador);  // Confirmar la cuenta de administrador
router.post("/olvide-password", olvidePassword);     // Reestablecer la contraseña del usuario
router.get("/olvide-password/:tokenAdmin", comprobarToken);  // Validamos token al reestablecer contraseña
router.post("/olvide-password/:tokenAdmin", nuevoPassword);  // Colocamos la nueva contraseña

router.get("/perfil", checkAuthAdmin, perfil);

export default router;
