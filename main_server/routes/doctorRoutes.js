import express from "express";
const router = express.Router();

import  { 
        registrarDoctor, 
        loginDoctor, 
        confirmarDoctor 
        } from "../controllers/doctorController.js";

//Registro, login y confirmar Doctores
router.post("/", registrarDoctor);
router.post("/login", loginDoctor);
router.get("/confirmar/:tokenDoctor", confirmarDoctor);

export default router;