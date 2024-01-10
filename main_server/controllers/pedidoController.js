import Pedido from "../models/Pedido.js"
import Paciente from "../models/Paciente.js"

//Generar pedido
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
        await pedido.save();

        // Almacenamos el nombre del pedido en los pedidos del paciente
        paciente.pedidosPaciente.push(pedido.nombrePedido);
        await paciente.save();
        res.json({ pedido });
    } catch (error) {
        console.log(error);
    }
};

export {
    generarPedido
};
