import express from "express";
import checkAuthDoctor from "../middleware/checkAuthDoctor.js";
import checkAuthAdmin from "../middleware/checkAuthAdmin.js";
const router = express.Router();

import  { 
        registrarDoctor, 
        loginDoctor, 
        confirmarDoctor,
        aceptarDoctor,
        olvidePassword,
        comprobarToken,
        nuevoPassword,
        modificarInformacion,
        nuevoHorario,
        removerHorario,
        verCitas,
        procesarCita,
        consultarDoctores,
        consultarDoctor,
        eliminarDoctor
        } from "../controllers/doctorController.js";

//Registro, login y confirmar Doctores
router.post("/", registrarDoctor);
router.post("/login", loginDoctor);
router.post("/confirmar/:tokenDoctor", confirmarDoctor);
router.post("/aceptarDoctor",checkAuthAdmin, aceptarDoctor);            //Dudas sobre su implementacion
router.post("/olvide-password", olvidePassword);
router.get("/olvide-password/:tokenDoctor", comprobarToken);
router.post("/olvide-password/:tokenDoctor", nuevoPassword);
// Modificar información
router.put("/main/modificar-informacion", checkAuthDoctor, modificarInformacion);
// Agregar horarios
router.put("/main/agregar-horario", checkAuthDoctor, nuevoHorario);
router.delete("/main/eliminar-horario", checkAuthDoctor, removerHorario);
// Ver citas
router.get("/main/ver-citas", checkAuthDoctor, verCitas);
// Procesar citas
router.post("/main/procesar-citas", checkAuthDoctor, procesarCita);
//Consultar doctores
router.get("/consultarDoctores", checkAuthAdmin, consultarDoctores);
//Consultar doctor
router.get("/consultarDoctor/:usernameDoctor", checkAuthAdmin, consultarDoctor)
//Eliminar doctor
router.delete("/eliminarDoctor/:usernameDoctor", checkAuthAdmin, eliminarDoctor)


export default router;