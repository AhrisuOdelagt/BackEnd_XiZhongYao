import express from "express";
import { generarPedido,
    pagarPedido,
    terminarPedido,
    verPedidos
    } from "../controllers/pedidoController.js";
import checkAuthPaciente from "../middleware/checkAuthPaciente.js";
import checkAuthAdmin from "../middleware/checkAuthAdmin.js"

const router = express.Router();

// Generación de pedido
router.get("/main/generar-pedido", checkAuthPaciente, generarPedido);
// Pagar pedidos
router.post("/main/pagar-pedido", checkAuthPaciente, pagarPedido);
// Termimar pedidos (admin)
router.post("/main/terminar-pedido", checkAuthAdmin, terminarPedido);
// Visualizar pedidos (admin)
router.get("/main/visualizar-pedidos", checkAuthAdmin, verPedidos)

export default router;
