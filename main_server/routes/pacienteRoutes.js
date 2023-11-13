import express from "express";
const router = express.Router();

import { registrarPaciente, loginPaciente, confirmarPaciente } from "../controllers/pacienteController.js";

//Registro, login y confirmar Paciente

router.post("/", registrarPaciente)
router.post("/login", loginPaciente);
router.post("/confirmar/:tokenPaciente", confirmarPaciente);

export default router;