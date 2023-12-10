import express from "express";
import checkAuthAdmin from "../middleware/checkAuthAdmin.js";
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
router.post("/aceptarDoctor",checkAuthAdmin, aceptarDoctor);            //Dudas sobre su implementacion
router.post("/olvide-password", olvidePassword);
router.get("/olvide-password/:tokenDoctor", comprobarToken);
router.post("/olvide-password/:tokenDoctor", nuevoPassword);


export default router;