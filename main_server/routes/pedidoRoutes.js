import express from "express";
import { generarPedido } from "../controllers/pedidoController.js";
import checkAuthPaciente from "../middleware/checkAuthPaciente.js";

const router = express.Router();

// Generación de pedido
router.get("/main/generar-pedido", checkAuthPaciente, generarPedido);

export default router;
