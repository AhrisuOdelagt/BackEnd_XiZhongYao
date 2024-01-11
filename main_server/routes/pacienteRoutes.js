import express from "express";
import checkAuthPaciente from "../middleware/checkAuthPaciente.js";
const router = express.Router();

import { registrarPaciente,
    loginPaciente,
    confirmarPaciente, 
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    agregarProductoCarrito,
    incrementarProductoCarrito,
    decrementarProductoCarrito,
    eliminarProductoCarrito, 
    vaciarCarrito, 
    visualizarCarrito,
    verHistorialPedidos,
    generarCita,
    verDoctores,
    agregarTarjeta,
    eliminarTarjeta } from "../controllers/pacienteController.js";

//Registro, login y confirmar Paciente
router.post("/", registrarPaciente)
router.post("/login", loginPaciente);
router.get("/confirmar/:tokenPaciente", confirmarPaciente);
router.post("/olvide-password", olvidePassword)
router.get("/olvide-password/:tokenPaciente", comprobarToken)
router.post("/olvide-password/:tokenPaciente", nuevoPassword)

//Carrito
router.post("/main/carrito/agregar-producto", checkAuthPaciente, agregarProductoCarrito);
router.put("/main/carrito/incrementar-producto", checkAuthPaciente, incrementarProductoCarrito);
router.delete("/main/carrito/decrementar-producto", checkAuthPaciente, decrementarProductoCarrito);
router.delete("/main/carrito/eliminar-producto", checkAuthPaciente, eliminarProductoCarrito);
router.delete("/main/carrito/vaciar-carrito", checkAuthPaciente, vaciarCarrito);
router.get("/main/carrito/visualizar-carrito", checkAuthPaciente, visualizarCarrito);

//Pedidos
router.get("main/pedido/visualizar-pedido", checkAuthPaciente, verHistorialPedidos);

// Gestionar citas
router.post("/main/generar-cita", checkAuthPaciente, generarCita);
router.get("/main/ver-doctores", checkAuthPaciente, verDoctores);

// Tarjetas
router.post("/main/agregar-tarjeta", checkAuthPaciente, agregarTarjeta);
router.delete("/main/eliminar-tarjeta/:numTarjeta", checkAuthPaciente, eliminarTarjeta);

export default router;