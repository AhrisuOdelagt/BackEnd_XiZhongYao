import express from "express";
import checkAuthAdmin from "../middleware/checkAuthAdmin.js";
import checkAuthPaciente from "../middleware/checkAuthPaciente.js"
import {
    registrarProducto,
    verProductos,
    verProducto,
    modificarProducto,
    eliminarProducto,
    verProductosPaciente
} from "../controllers/productosController.js";

const router = express.Router();

// Registrar producto
router.post("/registrarProducto", checkAuthAdmin, registrarProducto);
// Ver productos
router.get("/verProductos", checkAuthAdmin, verProductos);
// Ver producto
router.get("/verProducto/:nombreProducto", checkAuthAdmin, verProducto);
// Modificar producto
router.put("/modificarProducto/:nombreProducto", checkAuthAdmin, modificarProducto);
// Elminar producto
router.delete("/eliminarProducto/:nombreProducto", checkAuthAdmin, eliminarProducto);
//Ver productos paciente
router.post("/verProductos", checkAuthPaciente, verProductosPaciente);

export default router;
