import express from "express";
import checkAuthPaciente from "../middleware/checkAuthPaciente.js";
const router = express.Router();

import { registrarPaciente, 
    loginPaciente, 
    confirmarPaciente, 
    comprobarToken, 
    olvidePassword,
    nuevoPassword,
    generarCita,
    verDoctores } from "../controllers/pacienteController.js";

//Registro, login y confirmar Paciente
router.post("/", registrarPaciente)
router.post("/login", loginPaciente);
router.get("/confirmar/:tokenPaciente", confirmarPaciente);
router.post("/olvide-password", olvidePassword)
router.get("/olvide-password/:tokenPaciente", comprobarToken)
router.post("/olvide-password/:tokenPaciente", nuevoPassword)

// Gestionar citas
router.post("/main/generar-cita", checkAuthPaciente, generarCita);
router.get("/main/ver-doctores", checkAuthPaciente, verDoctores);

export default router;