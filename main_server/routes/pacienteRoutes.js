import express from "express";
const router = express.Router();

import { registrarPaciente, 
    loginPaciente, 
    confirmarPaciente, 
    comprobarToken, 
    olvidePassword,
    nuevoPassword,
    agregarProductoCarrito,
    incrementarProductoCarrito, 
    decrementarProductoCarrito,
    eliminarProductoCarrito,
    vaciarCarrito,
    visualizarCarrito,
    verHistorialPedidos} from "../controllers/pacienteController.js";

//Registro, login y confirmar Paciente

router.post("/", registrarPaciente)
router.post("/login", loginPaciente);
router.get("/confirmar/:tokenPaciente", confirmarPaciente);
router.post("/olvide-password", olvidePassword)
router.get("/olvide-password/:tokenPaciente", comprobarToken)
router.post("/olvide-password/:tokenPaciente", nuevoPassword)

//Carrito
router.post("/carrito/agregarProducto", agregarProductoCarrito);
router.post("/carrito/incrementarProducto", incrementarProductoCarrito);
router.post("/carrito/decrementarProducto", decrementarProductoCarrito);
router.post("/carrito/eliminarProducto", eliminarProductoCarrito);
router.get("/carrito/vaciarCarrito", vaciarCarrito);
router.get("/carrito/visualizarCarrito", visualizarCarrito);

//Pedidos
router.get("ped/visualizar", verHistorialPedidos);


router.get("/perfil", )


export default router;