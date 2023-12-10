import express from "express";
const router = express.Router();

import { registrarPaciente, 
    loginPaciente, 
    confirmarPaciente, 
    comprobarToken, 
    olvidePassword,
    nuevoPassword} from "../controllers/pacienteController.js";

//Registro, login y confirmar Paciente

router.post("/", registrarPaciente)
router.post("/login", loginPaciente);
router.get("/confirmar/:tokenPaciente", confirmarPaciente);
router.post("/olvide-password", olvidePassword)
router.get("/olvide-password/:tokenPaciente", comprobarToken)
router.post("/olvide-password/:tokenPaciente", nuevoPassword)

router.get("/perfil", )


export default router;