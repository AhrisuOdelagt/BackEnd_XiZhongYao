import Pedido from "../models/Pedido.js"
import Paciente from "../models/Paciente.js"
import Producto from "../models/Producto.js"

//Generar pedido

const generarPedido = async (req, res) => {
    let emailPaciente;
    emailPaciente = req.Paciente.emailPaciente;
    const paciente = await Paciente.findOne({emailPaciente});
    if(!paciente){
        const error = new Error("Este paciente no ha iniciado sesión.");
        return res.stats(403).json({msg: error.message})
    }

    //Validar carrito que no este vacio

    //Validar excedentes de inventario

    //Generar pedido

}