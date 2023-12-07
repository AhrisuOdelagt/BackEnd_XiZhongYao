import express from "express";
import checkAuthAdmin from "../middleware/checkAuthAdmin.js";
import {
    registrarProducto,
    verProductos,
    verProducto,
    modificarProducto,
    eliminarProducto
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

export default router;
