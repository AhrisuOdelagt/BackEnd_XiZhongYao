import express from "express";
const router = express.Router();

import  { 
        registrarDoctor, 
        loginDoctor, 
        confirmarDoctor,
        aceptarDoctor,
        olvidePassword,
        comprobarToken,
        nuevoPassword
        } from "../controllers/doctorController.js";

//Registro, login y confirmar Doctores
router.post("/", registrarDoctor);
router.post("/login", loginDoctor);
router.get("/confirmar/:tokenDoctor", confirmarDoctor);
router.post("/aceptarDoctor", aceptarDoctor);            //Dudas sobre su implementacion
router.post("/olvide-password", olvidePassword);
router.get("/olvide-password/:tokenDoctor", comprobarToken);
router.post("/olvide-password/:tokenDoctor", nuevoPassword);


export default router;