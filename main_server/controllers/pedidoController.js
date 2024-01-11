import Pedido from "../models/Pedido.js"
import Paciente from "../models/Paciente.js"
import Administrador from "../models/Administrador.js";
import Producto from "../models/Producto.js"

// Generar pedido
const generarPedido = async (req, res) => {
    // Realizamos validación del paciente
    let emailPaciente;
    emailPaciente = req.paciente.emailPaciente;
    const paciente = await Paciente.findOne({ emailPaciente });
    if(!paciente){
        const error = new Error("Este usuario no ha iniciado sesión"); 
        return res.status(403).json({msg: error.message});
    }

    // Validamos que el carrito no esté vacío
    if(paciente.carritoCompras.length < 1){
        const error = new Error("No hay productos en el carrito.");
        return res.status(404).json({msg: error.message});
    }

    // Verificamos que no se quieran comprar excedentes de inventario
    const prec = paciente.carritoCompras;
    for (let index = 0; index < prec.length; index++) {
        if(prec[index].cantidad_C > prec[index].copiaInv_C){
            const error = new Error(`Hubo una modificación en el inventario del producto '${prec[index].producto_C}'. Decremente la cantidad a comprar.`);
            return res.status(403).json({msg: error.message});
        }
    }
    
    // Generamos el pedido
    try {
        const nombrePedido = `${paciente.usernamePaciente}_${Date.now().toString()}`
        const pedido = new Pedido({ nombrePedido });
        await pedido.save();
        // Definimos los detalles del pedido
        pedido.detallesPedidos = [];
        let compras = paciente.carritoCompras;
        // console.log(compras);
        for (let index = 0; index < compras.length; index++) {
            let detalles = {
                producto_P: compras[index].producto_C,
                cantidad_P: compras[index].cantidad_C,
                totalParcial_P: compras[index].totalParcial_C,
                img_P: compras[index].img_C
            }
            pedido.detallesPedidos.push(detalles);
        }
        await pedido.save();
        
        // Definimos el resto de atributos del pedido
        let comprasPedido = pedido.detallesPedidos;
        for (let index = 0; index < comprasPedido.length; index++) {
            console.log(comprasPedido[index])
            pedido.costoArticulos += comprasPedido[index].totalParcial_P;
            console.log(pedido.costoArticulos)
            pedido.totalArticulos += comprasPedido[index].cantidad_P;
            console.log(pedido.totalArticulos)
        }
        let total = pedido.costoArticulos;
        console.log("CHECKPOINT")
        pedido.costoTotal = total;
        pedido.pacientePedido = paciente._id;
        pedido.metodoPago = "Tarjeta";
        await pedido.save();

        // Almacenamos el nombre del pedido en los pedidos del paciente
        paciente.pedidosPaciente.push(pedido.nombrePedido);
        await paciente.save();
        res.json({ pedido });
    } catch (error) {
        console.log(error);
    }
};

// Pagar pedido
const pagarPedido = async (req, res) => {
    // Realizamos validación del paciente
    let emailPaciente;
    emailPaciente = req.paciente.emailPaciente;
    const paciente = await Paciente.findOne({ emailPaciente });
    if(!paciente){
        const error = new Error("Este usuario no ha iniciado sesión"); 
        return res.status(403).json({msg: error.message});
    }

    // Tomamos información del JSON para el pedido
    const { nombrePedido,
        fechaEntrega,
        tarjetaPedido, } = req.body;

    const { numTarjeta_P,
        fechaVencimiento_P,
        cvv_P
        } = tarjetaPedido;

    // Verificamos que exista el pedido
    const pedido = await Pedido.findOne({ nombrePedido });
    if(!pedido){
        const error = new Error("El número de pedido es incorrecto");
        return res.status(404).json({msg: error.message});
    }

    // Verificamos que el pedido no esté pagado
    if(pedido.isPaid == true){
        const error = new Error("Ocurrió un error");
        return res.status(400).json({msg: error.message});
    }

    // Verificamos el método de pago
    if(pedido.metodoPago != "Tarjeta"){
        const error = new Error("Método de pago inválido"); /* Mensaje faltante */
        return res.status(403).json({msg: error.message});
    }

    // Realizamos el pago
    try {
        // Reestablecemos la fecha de entrega, de existir una nueva
        if(fechaEntrega != undefined){
            pedido.fechaEntrega = fechaEntrega;
        }
        await pedido.save();
        // Realizamos el pago con tarjeta
        let tarjeta = {
            numTarjeta_P: numTarjeta_P,
            fechaVencimiento_P: fechaVencimiento_P,
            cvv_P: cvv_P
        };
        tarjeta = {
            numTarjeta_P: numTarjeta_P,
            fechaVencimiento_P: undefined,
            cvv_P: undefined
        }
        pedido.tarjetaPedido = tarjeta;
        // Marcamos el pedido como pagado
        pedido.isPaid = true;
        await pedido.save();
        // Actualizar inventario
        let pedidos = pedido.detallesPedidos;
        for (let index = 0; index < pedidos.length; index++) {
            let nombreProducto = pedidos[index].producto_P;
            const producto = await Producto.findOne({ nombreProducto });
            producto.cantidadInv -= pedidos[index].cantidad_P;
            await producto.save();
        }
        // Vaciamos el carrito de compras del cliente
        paciente.carritoCompras = [];
        await paciente.save();
        // Retornamos un mensaje de confirmación
        res.json({ msg: "El pedido se ha pagado" });

    } catch (error) {
        console.log(error);
    }
};

const terminarPedido = async (req, res) => {
    // Autenticamos sesión del administrador
    let emailAdmin;
    emailAdmin = req.administrador.emailAdmin;
    const admin = await Administrador.findOne({ emailAdmin });
    // Verificamos una sesión de administrador activa
    if (!admin) {
        const error = new Error("Este usuario no ha iniciado sesión.");
        return res.status(403).json({msg: error.message});
    }
    // Verificamos que el administador esté autorizado
    if(admin.isAdmin == false){
        const error = new Error("Este usuario no es administrador o no está autorizado.");
        return res.status(403).json({msg: error.message});
    }

    // Tomamos información del JSON para el pedido
    const { nombrePedido } = req.body;

    // Verificamos que el pedido exista
    const pedido = await Pedido.findOne({ nombrePedido });
    if(!pedido){
        const error = new Error("El número de pedido es incorrecto");
        return res.status(404).json({msg: error.message});
    }

    // Verificamos si el pedido se pagó
    if (pedido.isPaid == true) {
        try {
            pedido.isFinished = true;
            await pedido.save();
            res.json({ msg: "Se ha actualizado el status del pedido" });
        } catch (error) {
            console.log(error);
        }
    }
};

const verPedidos = async (req, res) => {
    // Autenticamos sesión del administrador
    let emailAdmin;
    emailAdmin = req.administrador.emailAdmin;
    const admin = await Administrador.findOne({ emailAdmin });
    // Verificamos una sesión de administrador activa
    if (!admin) {
        const error = new Error("Este usuario no ha iniciado sesión.");
        return res.status(403).json({msg: error.message});
    }
    // Verificamos que el administador esté autorizado
    if(admin.isAdmin == false){
        const error = new Error("Este usuario no es administrador o no está autorizado.");
        return res.status(403).json({msg: error.message});
    }

    //Obtenemos los Pedidos
    try {
        const documentos = await Pedido.find();
        if (documentos.length < 1) {
            const error = new Error("No existen pedidos");
            return res.status(404).json({ msg: error.message });
        }
        res.json({ pedidos: documentos });
    } catch (error) {
        console.log(error);
    }
};

export {
    generarPedido,
    pagarPedido,
    terminarPedido,
    verPedidos
};
